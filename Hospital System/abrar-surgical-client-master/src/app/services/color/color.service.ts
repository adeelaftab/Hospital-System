import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor() { }

  isValid(color: string) {
    if (color.startsWith('#')) {
      return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
    } else if (color.startsWith('rgb')) {
      return true;
    }
  }

  public hexToRgb(hex: string) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  public rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const HEX = x.toString(16);
      return HEX.length === 1 ? '0' + HEX : HEX;
    }).join('');
  }

  public hsvToRgb(h: number, s: number, v: number): Array<number> {
    let r: number, g: number, b: number;

    let i: number = Math.floor(h * 6);
    let f: number = h * 6 - i;
    let p: number = v * (1 - s);
    let q: number = v * (1 - f * s);
    let t: number = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }

    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    ];
  }

  public rgbToHsv(r: number, g: number, b: number): Array<number> {
    let max: number = Math.max(r, g, b);
    let min: number = Math.min(r, g, b);
    let h: number;
    let d: number = max - min;
    let s: number = (max === 0 ? 0 : d / max);
    let v: number = max / 255;

    switch (max) {
      case min: h = 0; break;
      case r: h = (g - b) + d * (g < b ? 6 : 0); h /= 6 * d; break;
      case g: h = (b - r) + d * 2; h /= 6 * d; break;
      case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }
    return [h, s, v];
  }

  public checkContrastColor(r: number, g: number, b: number): string {
    let color: string;
    if ((r * 0.299 + g * 0.587 + b * 0.114) > 186) {
      color = '#000';
    } else {
      color = '#fff';
    }
    return color;
  }
}
