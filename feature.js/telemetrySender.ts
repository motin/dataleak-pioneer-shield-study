import { humanFileSize } from "./humanFileSize";

declare namespace browser.study {
  const logger: any;
  function calculateTelemetryPingSize(payload: any);
  function sendTelemetry(payload: any);
}

import {
  /*Navigation, */ HttpRequest,
  HttpResponse,
  HttpRedirect,
  JavascriptOperation,
  JavascriptCookieChange,
} from "openwpm-webext-instrumentation";
import { CapturedContent, LogEntry } from "./dataReceiver";

type OpenWPMType =
  | "navigations"
  | "http_requests"
  | "http_responses"
  | "http_redirects"
  | "javascript"
  | "javascript_cookies"
  | "openwpm_log"
  | "openwpm_captured_content";
type OpenWPMPayload /*Navigation |*/ =
  | HttpRequest
  | HttpResponse
  | HttpRedirect
  | JavascriptOperation
  | JavascriptCookieChange
  | LogEntry
  | CapturedContent;

interface StudyTelemetryPacket {
  type: OpenWPMType;
  payload: OpenWPMPayload;
}

interface StringStringMap {
  [k: string]: string;
}

export class TelemetrySender {
  async submitTelemetryPayload(type, payload) {
    const studyTelemetryPacket: StudyTelemetryPacket = {
      type,
      payload,
    };
    const stringStringMap: StringStringMap = this.createShieldPingPayload(
      studyTelemetryPacket,
    );
    return this.sendTelemetry(stringStringMap);
  }

  // TODO: @glind: move to shield study utils?
  createShieldPingPayload(shieldPingAttributes): StringStringMap {
    const shieldPingPayload = {};

    // shield ping attributes must be strings
    for (const attribute in shieldPingAttributes) {
      let attributeValue = shieldPingAttributes[attribute];
      if (typeof attributeValue === "undefined") {
        attributeValue = "null";
      }
      if (typeof attributeValue === "object") {
        attributeValue = JSON.stringify(attributeValue);
      }
      if (typeof attributeValue !== "string") {
        attributeValue = String(attributeValue);
      }
      shieldPingPayload[attribute] = attributeValue;
    }

    return shieldPingPayload;
  }

  async sendTelemetry(stringStringMap: StringStringMap) {
    const calculatedPingSize = await browser.study.calculateTelemetryPingSize(
      stringStringMap,
    );
    await browser.study.logger.info(
      `Calculated size of the ${
        stringStringMap.type
      } ping which is being submitted: ${humanFileSize(calculatedPingSize)}`,
    );
    return browser.study.sendTelemetry(stringStringMap);
  }
}

// export a singleton
export const telemetrySender = new TelemetrySender();
