import { Component, EventHandler } from "cc";

class CsvParser {
  static parse(string: string) {

    string = CsvParser.removeLine(string);

    const dataList = [];
    const headArr = [];
    const str = {
      str: "",
    };
    str.str = "";
    let firstLine = true;
    let headNum = 0;
    let data = {};

    for (let i = 0; i < string.length; i++) {
      switch (string[i]) {
        case "\r":
          break;
        case "\n":
          if (firstLine) {
            headArr.push(str.str);
            firstLine = false;
          }
          else {
            data[headArr[headNum]] = str.str;
            dataList.push(data);
          }


          str.str = "";
          headNum = 0;
          data = {};
          break;
        case undefined:
          if (firstLine) {
            headArr.push(str.str);
            firstLine = false;
          }
          else {
            data[headArr[headNum]] = str.str;
            dataList.push(data);
          }


          str.str = "";
          headNum = 0;
          data = {};
          break;
        case "\"":
          i++;
          while (true) {
            if (string[i] === "\"" && string[i + 1] === "\"") {
              str.str += string[i];
              i++;
              i++;
            }
            else if (string[i] === "\"" && (!string[i + 1] || string[i + 1] !== "\"")) {
              break;
            }
            else {
              str.str += string[i];
              i++;
            }
          }
          break;
        case ",":


          if (firstLine) {
            headArr.push(str.str);
          }
          else {
            data[headArr[headNum]] = str.str;
          }

          headNum++;
          str.str = "";
          break;
        case "﻿":
          break;
        default:
          str.str += string[i];
          break;
      }
    }

    if (headNum !== 0) {
      data[headArr[headNum]] = str.str;
      dataList.push(data);
    }

    return dataList;
  }

  static removeLine(str: string): string {

    const line = str.split('\n');
    let result = '';

    for (let i = 0; i < line.length; i++) {
      if (line[i][0] === '#') continue;
      if (result === '') {
        result += line[i];
      }
      else {
        result += '\n' + line[i];
      }
    }

    return result;
  }
}

class Util {
  public shuffle<T>(array: T[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  }

  public callEventHandlers(handlers: EventHandler[]) {
    for (let e of handlers) {
      e.emit([e.customEventData]);
    }
  }

  public formatString(format: string, ...args: any[]) {
    return format.replace(/{(\d+)}/g, (match, idx) =>
      idx < args.length && args[idx] != null ? args[idx] : match
    );
  }

  public zeroFill(num: number, digits: number = 2) {
    return num.toLocaleString("en-US", {
      minimumIntegerDigits: digits,
    });
  }

  public getUrlParams(key: string) {
    const params = new URLSearchParams(window.location.search);

    if (params.has(key)) {
      return params.get(key);
    }

    return "";
  }

  public bezier(p0: number, p1: number, p2: number, t: number): number {
    // 2차 베지어 공식: (1 - t)^2 * p0 + 2(1 - t)t * p1 + t^2 * p2
    const u = 1 - t;
    return u * u * p0 + 2 * u * t * p1 + t * t * p2;
  }

  public csvParse(str: string) {
    return CsvParser.parse(str);
  }

  public getDefault<Scripts extends Component>(target: Scripts, script: Scripts) {
    if (null === target) {
      target = script;
    }

    return target;
  }
}

export default new Util();
