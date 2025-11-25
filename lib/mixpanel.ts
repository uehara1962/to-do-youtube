import Mixpanel from "mixpanel";

const mixpanelEvent = Mixpanel.init(process.env.MIXPANEL_TOKEN!);

export function trackServerEvent(eventName: string, properties: Record<string, unknown>) {
  
  if (process.env.NODE_ENV === "production") {
  mixpanelEvent.track(eventName, properties);
}





// ------------ Mixpanel ------------
// import mixpanel from "mixpanel-browser";

// export const initMixpanel = () => {
//   mixpanel.init(process.env.MIXPANEL_TOKEN!, {
//     autocapture: true,
//     record_sessions_percent: 100,
//   });
// };