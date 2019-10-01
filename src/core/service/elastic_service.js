import elasticsearch from '@elastic/elasticsearch';
import { finalConfig } from '../../../config';
import { userModel, activityModel } from '../model';
import { logger } from '../../logger';

const current_datetime = new Date();
const activityMapping = {
    "properties": {
        "clockin": {
            "type": "date"
        },
        "clockout": {
            "type": "date"
        },
        "location": {
            "properties": {
                "point": {
                    "properties": {
                        "coordinates": {
                            "type": "geo_point"
                        }
                    }
                }
            }
        }

    }
};

const client = new elasticsearch.Client({ node: finalConfig.elasticConfig });

async function insertActivity(activity) {
    let gp7Date = new Date(activity.clockin);
    let indexStr = `activity-${gp7Date.getDate()}-${gp7Date.getMonth() + 1}-${gp7Date.getFullYear()}`;
    let haveIndex = false;
    try {
        const indexExists = await client.indices.exists({ index: indexStr })
        haveIndex = indexExists.body
        logger.info("body", indexExists.body)
        if (!haveIndex) {
            logger.debug(`try create index: [${indexStr}]`);
            await client.indices.create({
                index: indexStr, body: {
                    mappings: activityMapping,
                    settings: {}
                }
            });
            logger.info(`create index: [${indexStr}] success`);

            haveIndex = true;

        }
    }
    catch (err) {
        if (err.body !== undefined && err.body.error !== undefined) {
            if (err.body.error.type === 'resource_already_exists_exception') {
                haveIndex = true;
                logger.debug(`create index: [${indexStr}] already exist`);
            }
            else {
                logger.error("cannot create index: ", err.body.error.type);
            }
        }
        else {
            logger.error("error is undefined:" + err);
        }

    }
    if (haveIndex) {
        try {
            await client.index({
                index: indexStr,
                type: '_doc',
                refresh: true,
                body: activity
            });
            logger.debug("insert activity: " + JSON.stringify(activity) + " success");
        }
        catch (err) {
            logger.error("cannot insert activity: ", err.body.error.type);
        }
    }

}


async function elastic_update(obj, target) {
    var presentIndex = 'activity-' + current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear();
    var queryArray = [];
    for (var property in obj) {
        if (obj[property] != null && property != target) {
            queryArray.push({ match: { [property]: obj[property] } });
        }
    }
    var scriptSet = `ctx._source.${target} = '${obj[target]}'; `;
    try {

      const updatefromelastic =  await client.updateByQuery({
            index: presentIndex,
            refresh: true,
            body: {
                "query": {
                    "bool": {
                        "must": queryArray
                    }
                },
                "script": scriptSet
            }
        })
        logger.debug(`update elastic : [${presentIndex}]`);
    }
    catch (err) {
        logger.error("cannot update activity: ", err);
    }

}



class ElasticService {
    constructor() {
        this.indexTable = {};
        this.save = insertActivity;
        this.update = elastic_update;

    }
}


export {
    ElasticService
};