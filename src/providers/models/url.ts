export const UserUrl = {
  users: 'users/search/page',
  add: 'users/save',

  roles(orgId: number) {
    return `roles/orgs/${orgId}`
  },

  getByUsername(username: string) {
    // /uc/users/username/{username}
    return `/users/username/${username}`
  },

  //users/users/{id}
  update(id: number) {
    return `users/${id}`
  },

  deleteUser(id: number) {
    //users/users/:id/delete"
    return `users/${id}/delete`
  },

  resetPwd(id: number) {
    return `users/${id}/resetPwd`
  },

  changePwd(id:number) {
    return `users/${id}/changePwd`
  }

}

export const DictUrl = {
  // uc/dicts/groups/keys/{key}/items
  itemsByGroupKey(key: string){
    return `dicts/groups/keys/${key}/items`
  }
}
