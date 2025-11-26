import { Metadata } from "next";

type SeoMetadata = {
  appName: string;
  AppDescription: string;
  Keywords: string[];
  appDomain: string;
  canonicalUrlRelative: string;
  extraTags?: Metadata;
  locale?: string;
}

export function getSeoTags({
  appName,
  AppDescription,
  Keywords,
  appDomain,
  canonicalUrlRelative,
  extraTags,
  locale,
}: SeoMetadata): Metadata {
  return {
    title: appName,
    description: AppDescription,
    keywords: Keywords,
    applicationName: appName,
    metadataBase: new URL(appDomain),
    openGraph: {
      title: appName,
      description: AppDescription,
      url: appDomain,
      siteName: appName,
      locale: locale,
      type: "website",
    },
    alternates: {
      canonical: canonicalUrlRelative,
      languages: {
        pt: canonicalUrlRelative,
      },
    },
    ...extraTags,

  };
}