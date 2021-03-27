import { addLolly } from "./addLolly";
import { getLollies } from "./getLollies";

//ERROR: Keep fieldName like this not like this fieldname
type AppSyncEvent = {
    info: {
        fieldName: string
    },
    arguments: {
        lolly: Lolly,
    }
}

exports.handler = async (event: AppSyncEvent) => {
    switch (event.info.fieldName) {
        case "getLollies":
            return await getLollies();
        case "addLolly":
            return await addLolly(event.arguments.lolly)
        default:
            return null
    }
} 