export class DateClass {
	static unixNow = () => {
		return Math.round(Date.now() / 1000)
	}

	static dateToFormat(date: Date | number, needSeconds = true): string {
		if (typeof date === 'number') date = new Date(date * 1000)

		let dd: number | string = date.getDate()
		if (dd < 10) dd = '0' + dd

		let mm: number | string = date.getMonth() + 1
		if (mm < 10) mm = '0' + mm

		let hh: number | string = date.getHours()
		if (hh < 10) hh = '0' + hh

		let mi: number | string = date.getMinutes()
		if (mi < 10) mi = '0' + mi

		let ss: number | string = date.getSeconds()
		if (ss < 10) ss = '0' + ss

		return dd + '.' + mm + '.' + date.getFullYear() + ' ' + hh + ':' + mi + (needSeconds ? (':' + ss) : '')
	}
}
