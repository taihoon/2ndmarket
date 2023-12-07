export interface UserGroup {
  id: string, // firebase user id
  groupId: string,
  email: string
}

export type NewUserGroup = Omit<UserGroup, 'id'>;
