// import { formatHour } from "./format-datetime";
import { logColor } from "@/utils/log-color";

export async function asyncDelay(ms: number = 0, verbose: boolean = false) {
  if (ms <= 0) {
    return;
  }

  if (verbose) {
    logColor(`Delaying for ${ms / 1000}s`);
    // logColor(`Delaying for ${ms / 1000}s`, formatHour(Date.now()));
  }

  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
