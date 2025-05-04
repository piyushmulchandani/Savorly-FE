import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {
	transform(value: string, allWords: boolean = false): string {
		if (!value) return value;

		if (allWords) {
			return value
				.split(' ')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
				.join(' ');
		}

		return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
	}
}
