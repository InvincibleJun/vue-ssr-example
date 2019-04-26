import moment from 'moment';

moment.locale('zh-cn');

export const fromNow = date => (date ? moment(date).fromNow() : '');
