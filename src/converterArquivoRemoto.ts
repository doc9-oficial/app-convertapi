import docgo from 'docgo-sdk';
import ConvertApi from 'convertapi-js';

export default async function converterArquivoRemoto(params: any): Promise<void> {
  try {
    if (Array.isArray(params) && params.length === 1 && typeof params[0] === 'object') {
      params = params[0];
    }
    const { fileUrl, fromFormat, toFormat } = params;
    if (!fileUrl || !fromFormat || !toFormat) {
      return console.log(docgo.result(false, null, 'Parâmetros obrigatórios ausentes: fileUrl, fromFormat, toFormat'));
    }
    const token = docgo.getEnv('CONVERTAPI_TOKEN') || docgo.getEnv('convertapiToken');
    if (!token) {
      return console.log(docgo.result(false, null, 'Token ConvertAPI não configurado'));
    }
    const convertApi = ConvertApi.auth(token);
    const convParams = convertApi.createParams();
    convParams.add('file', new URL(fileUrl));
    const result = await convertApi.convert(fromFormat, toFormat, convParams);
    return console.log(docgo.result(true, { url: result.files[0].Url, result }));
  } catch (error: any) {
    return console.log(docgo.result(false, null, error.message));
  }
}
