export const runtime = "edge";

export default function NotFound() {
  return (
    <div className="bg-background text-foreground font-sans h-screen flex flex-col items-center justify-center text-center px-4">
      <title>404: This page could not be found.</title>
      <div className="error space-y-4"> {/* Added space-y-4 for vertical spacing */}
        <div>
          <h1 className="next-error-h1 border-r border-r-foreground/30 pr-6 mr-5 text-5xl font-bold align-top leading-none"> {/* Increased text size, bolded, tighter leading */}
            404
          </h1>
          <div className="desc inline-block">
            <h2 className="h2 text-lg font-semibold leading-normal m-0"> {/* Slightly larger text, semibold, normal leading */}
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-sm mt-2"> {/* Added a paragraph with muted text for extra context */}
              The requested URL was not found on this server.
            </p>
          </div>
        </div>
        <div className="mt-8"> {/* Added more margin top to separate from error message */}
          <a href="/" className="text-primary hover:underline"> {/* Added a link to go back home */}
            Go back to homepage
          </a>
        </div>
      </div>
    </div>
  );
}