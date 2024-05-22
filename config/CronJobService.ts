import { Service } from 'typedi';
import cron from 'node-cron';
import RefreshPropertyRequests from '../src/property-management/commands/application/usecases/RefreshPropertyRequests';

@Service()
export class CronJobService {
  constructor(private readonly refreshPropertyRequests: RefreshPropertyRequests) {}
  async setupCronJob() {
    cron.schedule(
      '0 0 */3 * *',
      async () => {
        console.log('Running a job every 3 days');
        await this.refreshPropertyRequests.execute();
      },
      {
        scheduled: true,
        timezone: 'UTC',
      },
    );
  }
}
