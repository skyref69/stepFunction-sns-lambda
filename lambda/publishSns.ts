import {SNSClient, PublishCommand} from "@aws-sdk/client-sns";

export const publishSns = async(event: any) => {
    const sns = new SNSClient('$.process.env.AWS_DEFAULT_REGION');    
    const publishCommand = new PublishCommand({
        Message: `Sent message test`,        
        TopicArn: process.env.SNS_TOPIC_ARN,
      });    
    await sns.send(publishCommand);
};
