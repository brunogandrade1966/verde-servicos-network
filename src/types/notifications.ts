
export interface Notification {
  id: string;
  user_id: string;
  type: 'message' | 'application' | 'project_update' | 'partnership';
  title: string;
  message: string;
  read: boolean;
  data?: any;
  created_at: string;
}
