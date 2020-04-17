import {SuppierQueryParam} from '@/providers/models/bs/suppier-query-model';
import HttpUtil from '@/providers/utils/http-util';
import {Gateway} from '@/providers/models/enums';
import {PageQuery} from '@/providers/models/common/http-model';
import {SupplierParam} from '@/providers/models/bs/suppier-model';

/**
 * 获取供应商分页信息
 * @param pageQuery
 */
function getSuppierPage(pageQuery: PageQuery<SuppierQueryParam>): Promise<any> {
    return HttpUtil.post({
        api: 'suppliers/page',
        gateway: Gateway.Bs,
        body: pageQuery
    })
}

/**
 * 获取供应商列表
 * @param pageQuery
 */
function getSuppierList(): Promise<any> {
    return HttpUtil.get({
        api: 'suppliers/names',
        gateway: Gateway.Bs
    })
}

/**
 * 获取某条供应商详细信息
 * @param id
 */
function getSupplier(id: number): Promise<SupplierParam> {
    return HttpUtil.get({
        api: `suppliers/${id}`,
        gateway: Gateway.Bs
    })
}

/**
 * 删除某条供应商信息
 * @param id
 */
function deleteSupplier(id: number): Promise<any> {
    return HttpUtil.post({
        api: `suppliers/${id}/delete`,
        gateway: Gateway.Bs
    })
}

/**
 * 添加供应商信息
 * @param supplierParam
 */
function addSupplier(supplierParam: SupplierParam): Promise<any> {
    return HttpUtil.post({
        api: '/suppliers',
        gateway: Gateway.Bs,
        body: supplierParam
    })
}

/**
 * 更新供应商信息
 * @param supplierParam
 */
function updateSupplier(supplierParam: SupplierParam): Promise<any> {
    return HttpUtil.post({
        api: `/suppliers/${supplierParam.id}`,
        gateway: Gateway.Bs,
        body: supplierParam
    })
}

/**
 * 判断名字是否重复
 * @param supplierName
 */
function isRepeat(supplierNames: string): Promise<any> {
    return HttpUtil.get({
        api: 'suppliers/name',
        gateway: Gateway.Bs,
        query: {
            supplierName: supplierNames
        },
        disableBsErrorHandle: true,
        disableHttpErrorHandle: true
    })
}



const SuppierService = {getSuppierPage, getSupplier, deleteSupplier, addSupplier, updateSupplier, isRepeat, getSuppierList}
export default SuppierService
