import {AlarmCountDataModel, AlarmQueryModel} from '@/providers/models/bs/report-model'
import HttpUtil from '@/providers/utils/http-util'

function getAlarmFrequencyData(queryParam: AlarmQueryModel): Promise<AlarmCountDataModel[]> {
  return HttpUtil.post({
    api: 'warning/info/top',
    body: queryParam
  })
}

function getAlarmNumberData(params: AlarmQueryModel): Promise<AlarmCountDataModel[]> {
  return HttpUtil.post({
    api: 'warning/count/eachDay',
    body: params
  })
}

const ReportService = {getAlarmFrequencyData, getAlarmNumberData}

export default ReportService