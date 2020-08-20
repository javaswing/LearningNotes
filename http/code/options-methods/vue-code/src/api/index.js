import axios from 'axios'

export function getList () {
    return axios({
        url: `//localhost:3000`,
        method: 'get',
        headers: {token: 'test'}
    })
}