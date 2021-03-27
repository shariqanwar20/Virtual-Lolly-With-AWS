import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as CodePipeline from '@aws-cdk/aws-codepipeline';
import * as CodePipelineAction from '@aws-cdk/aws-codepipeline-actions';
import * as CodeBuild from '@aws-cdk/aws-codebuild';
import { PolicyStatement } from '@aws-cdk/aws-iam'
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as amlify from '@aws-cdk/aws-amplify'
import * as origins from '@aws-cdk/aws-cloudfront-origins'

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const bucket = new s3.Bucket(this, "VirtualLollyWebsiteBucket", {
    //   publicReadAccess: true,
    //   websiteIndexDocument: 'index.html'
    // })

    // new s3Deploy.BucketDeployment(this, "bucketDeployment", {
    //   sources: [s3Deploy.Source.asset("../public")],
    //   destinationBucket: bucket
    // })

    // new cloudfront.CloudFrontWebDistribution(this, "DistributionForVirtualLolly", {
    //   originConfigs: [
    //     {
    //       s3OriginSource: {
    //         s3BucketSource: bucket
    //       },
    //       behaviors: [{
    //         isDefaultBehavior: true
    //       }]
    //     }
    //   ]
    // })

    // const s3Build = new CodeBuild.PipelineProject(this, 's3Build', {
    //   buildSpec: CodeBuild.BuildSpec.fromObject({
    //     version: '0.2',
    //     phases: {
    //       install: {
    //         "runtime-versions": {
    //           "nodejs": 12
    //         },
    //         commands: [
    //           'npm install -g gatsby',
    //           "npm install -g yarn"
    //         ],
    //       },
    //       pre_build: {
    //         commands: [
    //           "yarn",
    //         ]
    //       },
    //       build: {
    //         commands: [
    //           'gatsby build',
    //         ],
    //       },
    //     },
    //     artifacts: {
    //       'base-directory': './public',   ///outputting our generated Gatsby Build files to the public directory
    //       "files": [
    //         '**/*'
    //       ]
    //     },
    //   }),
    //   environment: {
    //     buildImage: CodeBuild.LinuxBuildImage.STANDARD_3_0,   ///BuildImage version 3 because we are using nodejs environment 12
    //   },
    // });

    // const policy = new PolicyStatement();
    // policy.addActions("s3:*")
    // policy.addResources("*")
    // s3Build.addToRolePolicy(policy)

    // const sourceOutput = new CodePipeline.Artifact();

    // const s3Output = new CodePipeline.Artifact();

    // const pipeline = new CodePipeline.Pipeline(this, "VirtualLollyDeploymentPipeline", {
    //   crossAccountKeys: false,
    //   restartExecutionOnUpdate: true
    // })

    // pipeline.addStage({
    //   stageName: "Source",
    //   actions: [
    //     new CodePipelineAction.GitHubSourceAction({
    //       actionName: "Checkout",
    //       owner: "shariqanwar20",
    //       repo: "Virtual-Lolly-AWS",
    //       oauthToken: cdk.SecretValue.plainText("0dde5ef459a6e527b809458ee9759910acec1dab"),
    //       output: sourceOutput,
    //       branch: "master"
    //     })
    //   ]
    // })

    // pipeline.addStage({
    //   stageName: "Build",
    //   actions: [
    //     new CodePipelineAction.CodeBuildAction({
    //       actionName: "s3Build",
    //       project: s3Build,
    //       input: sourceOutput,
    //       outputs: [s3Output]
    //     })
    //   ]
    // })

    // pipeline.addStage({
    //   stageName: "Deploy",
    //   actions: [
    //     new CodePipelineAction.S3DeployAction({
    //       actionName: "DeployToS3",
    //       input: s3Output,
    //       bucket: bucket
    //     })
    //   ]
    // })

    // const amplifyApp = new amlify.App(this, "VirtualLollyApp", {
    //   sourceCodeProvider: new amlify.GitHubSourceCodeProvider({
    //     owner: "shariqanwar20",
    //     repository: "Virtual-Lolly-AWS",
    //     oauthToken: cdk.SecretValue.plainText("0dde5ef459a6e527b809458ee9759910acec1dab")
    //   }),
    //   buildSpec: CodeBuild.BuildSpec.fromObject({
    //     version: '0.2',
    //     frontend: {
    //       phases: {
    //         preBuild: {
    //           commands: [
    //             "npm i -g gatsby",
    //             'yarn'
    //           ]
    //         },
    //         build: {
    //           commands: [
    //             'gatsby build'
    //           ]
    //         }
    //       },
    //       artifacts: {
    //         baseDirectory: 'public',
    //         files: '**/*'
    //       }
    //     },
    //     cache: {
    //       "paths": "node_modules/**/*"
    //     }
    //   })
    // })
    // amplifyApp.addBranch("master")

    const api = new appsync.GraphqlApi(this, "VirtuallollyGraphqlApi", {
      name: "VirtualLollyGraphqlApi",
      schema: appsync.Schema.fromAsset("graphql/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(7))
          }
        }
      }
    })

    const virtualLollyLambda = new lambda.Function(this, "VirtualLollyLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("functions"),
      handler: "main.handler",
      timeout: cdk.Duration.seconds(10)
    })
    events.EventBus.grantAllPutEvents(virtualLollyLambda);

    const lambdaDataSource = api.addLambdaDataSource("VirtualLollyDataSource", virtualLollyLambda)

    lambdaDataSource.createResolver({
      typeName: "Query",
      fieldName: "getLollies"
    })

    lambdaDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "addLolly"
    })

    const virtualLollyTable = new ddb.Table(this, "VirtualLollyTable", {
      tableName: "VirtualLolly",
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING
      }
    })
    virtualLollyLambda.addEnvironment("TABLE_NAME", virtualLollyTable.tableName)
    virtualLollyTable.grantFullAccess(virtualLollyLambda);

    // const codeRebuildRule = new events.Rule(this, "RebuildCodePipeline", {
    //   targets: [new targets.CodePipeline(pipeline)],
    //   description: "Rebuild the code pipeline when this event is sent to eventbus",
    //   eventPattern: {
    //     source: ["rebuildCodePipeline"],
    //   }
    // })

    new cdk.CfnOutput(this, "GraphqlUrl", {
      value: api.graphqlUrl
    })

    new cdk.CfnOutput(this, "ApiKey", {
      value: api.apiKey!
    })
  }
}
