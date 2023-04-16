import { MockApi, MockHttpMethod, MockOption } from '../types'
import menu from '../data/menu'
import role from '../data/role'
import example from '../data/example'

const userApis: MockApi[] = [
  {
    method: MockHttpMethod.POST,
    url: '/login',
    response(options: MockOption) {
      return {
        code: 0,
        data: {
          name: 'daodao97',
          token: 'xxxxxxx'
        }
      }
    }
  },
  {
    method: MockHttpMethod.GET,
    url: '/user/info',
    response(options: MockOption) {
      return {
        code: 0,
        data: {
          role_ids: [1],
          resource: [[0, 20, 'formItems', 'radio'], [0, 1, 2]]
        }
      }
    }
  },
  {
    url: '/user/routes',
    method: MockHttpMethod.GET,
    response: (options: MockOption) => {
      return {
        code: 0,
        data: [
          {
            id: 0,
            label: '',
            routes: []
          }
        ]
      }
    }
  },
  {
    url: '/user/list',
    method: MockHttpMethod.GET,
    response: (options: MockOption) => {
      return example.listMock
    }
  }
]

export default userApis
