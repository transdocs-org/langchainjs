import FirecrawlApp from "@mendable/firecrawl-js";
import { Document, type DocumentInterface } from "@langchain/core/documents";
import { getEnvironmentVariable } from "@langchain/core/utils/env";
import { BaseDocumentLoader } from "@langchain/core/document_loaders/base";

/**
 * Interface representing the parameters for the Firecrawl loader. It
 * includes properties such as the URL to scrape or crawl and the API key.
 */
interface FirecrawlLoaderParameters {
  /**
   * URL to scrape or crawl
   */
  url: string;

  /**
   * API key for Firecrawl. If not provided, the default value is the value of the FIRECRAWL_API_KEY environment variable.
   */
  apiKey?: string;

  /**
   * API URL for Firecrawl.
   */
  apiUrl?: string;
  /**
   * Mode of operation. Can be "crawl", "scrape", or "map". If not provided, the default value is "crawl".
   */
  mode?: "crawl" | "scrape" | "map";
  params?: Record<string, unknown>;
}

interface FirecrawlDocument {
  markdown?: string;
  html?: string;
  rawHtml?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Class representing a document loader for loading data from
 * Firecrawl (firecrawl.dev). It extends the BaseDocumentLoader class.
 * @example
 * ```typescript
 * const loader = new FireCrawlLoader({
 *   url: "{url}",
 *   apiKey: "{apiKey}",
 *   mode: "crawl"
 * });
 * const docs = await loader.load();
 * ```
 */
export class FireCrawlLoader extends BaseDocumentLoader {
  private apiKey: string;

  private apiUrl?: string;

  private url: string;

  private mode: "crawl" | "scrape" | "map";

  private params?: Record<string, unknown>;

  constructor(loaderParams: FirecrawlLoaderParameters) {
    super();
    const {
      apiKey = getEnvironmentVariable("FIRECRAWL_API_KEY"),
      apiUrl,
      url,
      mode = "crawl",
      params,
    } = loaderParams;
    if (!apiKey) {
      throw new Error(
        "Firecrawl API key not set. You can set it as FIRECRAWL_API_KEY in your .env file, or pass it to Firecrawl."
      );
    }

    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.url = url;
    this.mode = mode;
    this.params = params;
  }

  /**
   * Loads data from Firecrawl.
   * @returns An array of Documents representing the retrieved data.
   * @throws An error if the data could not be loaded.
   */
  public async load(): Promise<DocumentInterface[]> {
    const params: ConstructorParameters<typeof FirecrawlApp>[0] = {
      apiKey: this.apiKey,
    };
    if (this.apiUrl !== undefined) {
      params.apiUrl = this.apiUrl;
    }
    const app = new FirecrawlApp(params);
    let firecrawlDocs: FirecrawlDocument[];

    if (this.mode === "scrape") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await app.scrapeUrl(this.url, this.params as any);
      if (!response.success) {
        throw new Error(
          `Firecrawl: Failed to scrape URL. Error: ${response.error}`
        );
      }
      firecrawlDocs = [response] as FirecrawlDocument[];
    } else if (this.mode === "crawl") {
      const response = await app.crawlUrl(this.url, this.params);
      if (!response.success) {
        throw new Error(
          `Firecrawl: Failed to crawl URL. Error: ${response.error}`
        );
      }
      firecrawlDocs = response.data as FirecrawlDocument[];
    } else if (this.mode === "map") {
      const response = await app.mapUrl(this.url, this.params);
      if (!response.success) {
        throw new Error(
          `Firecrawl: Failed to map URL. Error: ${response.error}`
        );
      }
      firecrawlDocs = response.links as FirecrawlDocument[];

      return firecrawlDocs.map(
        (doc) =>
          new Document({
            pageContent: JSON.stringify(doc),
          })
      );
    } else {
      throw new Error(
        `Unrecognized mode '${this.mode}'. Expected one of 'crawl', 'scrape'.`
      );
    }

    return firecrawlDocs.map(
      (doc) =>
        new Document({
          pageContent: doc.markdown || doc.html || doc.rawHtml || "",
          metadata: doc.metadata || {},
        })
    );
  }
}
