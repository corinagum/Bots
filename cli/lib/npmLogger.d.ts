import IGenericActivity from '@bfemulator/emulator-core/lib/types/activity/generic';
import ILogger from '@bfemulator/emulator-core/lib/types/logger';
import ILogItem from '@bfemulator/emulator-core/lib/types/log/item';
export default class NpmLogger implements ILogger {
    logActivity(conversationId: string, activity: IGenericActivity, role: string): void;
    logMessage(conversationId: string, ...items: ILogItem[]): void;
    logException(conversationId: string, err: Error): void;
}
