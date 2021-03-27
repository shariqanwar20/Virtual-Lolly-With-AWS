import { addLolly } from "./addLolly";
import { getLollies } from "./getLollies";
import { getLollyById } from "./getLollyById";

//ERROR: Keep fieldName like this not like this fieldname
type AppSyncEvent = {
    info: {
        fieldName: string
    },
    arguments: {
        lolly: Lolly,
        id: string
    }
}

exports.handler = async (event: AppSyncEvent) => {
    switch (event.info.fieldName) {
        case "getLollies":
            return await getLollies();
        case "getLollyById":
            return await getLollyById(event.arguments.id);
        case "addLolly":
            return await addLolly(event.arguments.lolly)
        default:
            return null
    }
} 