import { getMembers } from '@/lib/members';
import { createApiHandler } from '@/lib/apiHandler';

export const revalidate = 60;

export const GET = createApiHandler({
  handler: async () => {
    return await getMembers();
  },
});
