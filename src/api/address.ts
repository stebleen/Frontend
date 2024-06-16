import request from '@/utils/request';
/**
 *
 * 地址管理
 *
 **/

// 查询地址列表接口
export const getAddressPage = (params: any) => {
    return request({
        url: '/address/list',
        method: 'get',
        params
    });
};

// 删除当前列的接口
export const deleAddress = (ids: string) => {
    return request({
        url: '/address',
        method: 'delete',
        params: { id: ids }
    });
};

// 修改接口
export const editAddress = (params: any) => {
    return request({
        url: '/address',
        method: 'put',
        data: { ...params }
    });
};

// 新增接口
export const addAddress = (params: any) => {
    return request({
        url: '/address',
        method: 'post',
        data: { ...params }
    });
};

