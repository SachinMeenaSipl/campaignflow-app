import { Queue } from "bullmq";
import IORedis from "ioredis";

type CampaignQueuePayload = {
  campaignId: string;
  templateId: string;
  recipients: Array<{ name: string; email: string }>;
};

let connection: IORedis | null = null;
let queue: Queue<CampaignQueuePayload> | null = null;

function getQueue() {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!connection) {
    connection = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null
    });

    connection.on("error", (error) => {
      console.error("Redis queue connection error", error);
    });
  }

  if (!queue) {
    queue = new Queue<CampaignQueuePayload>("campaign-delivery", {
      connection
    });
  }

  return queue;
}

export async function enqueueCampaign(payload: CampaignQueuePayload) {
  const activeQueue = getQueue();

  if (!activeQueue) {
    return {
      mode: "mock",
      queued: payload.recipients.length
    };
  }

  const job = await activeQueue.add("send-campaign", payload, {
    attempts: 3,
    removeOnComplete: 200,
    removeOnFail: 500,
    backoff: {
      type: "exponential",
      delay: 2000
    }
  });

  return {
    mode: "bullmq",
    queued: payload.recipients.length,
    jobId: job.id
  };
}
