import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createFileRoute("/week-11")({
  head: () => ({
    meta: [
      { title: "Week 11 Notes — Laravel Routing, Eloquent & Inertia" },
      {
        name: "description",
        content:
          "Analysis of CCS112 Week 11: Laravel routing and controllers, database modeling with Eloquent, and Inertia.js frontend integration.",
      },
      { property: "og:title", content: "Week 11 Notes — Laravel Routing, Eloquent & Inertia" },
      {
        property: "og:description",
        content:
          "Topics (c), (d) and (e) of Module 2 explained, with Labs 3–5 and the Task Manager walkthrough mapped to code.",
      },
    ],
  }),
  component: WeekElevenPage,
});

function Code({ children }: { children: ReactNode }) {
  return (
    <pre className="-mx-4 mt-3 overflow-x-auto border-y border-border bg-background/60 p-4 font-display text-[11px] leading-relaxed text-foreground/90 sm:mx-0 sm:rounded-lg sm:border sm:text-xs">
      <code>{children}</code>
    </pre>
  );
}

function Section({
  tag,
  title,
  children,
}: {
  tag: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="panel p-4 sm:p-6">
      <p className="font-display text-[10px] uppercase tracking-[0.2em] text-primary sm:text-xs">{tag}</p>
      <h2 className="mt-2 text-xl font-bold sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}


function Terms({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {items.map((t) => (
        <span
          key={t}
          className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function WeekElevenPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="mb-6 sm:mb-8">
        <p className="font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs sm:tracking-[0.25em]">
          Module 2 · Backend Development Technologies
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          <span className="text-ember">Week 11</span> — Data, Routing &amp; Frontend Integration
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Week 11 closes Module 2 by joining three layers into one request cycle: a route resolves
          a URL to a controller action, Eloquent turns that action into database work, and Inertia
          hands the result to a React page as props. Labs 3–5 build each layer in turn, and the
          guided walkthrough (Task Manager) stitches them together.
        </p>
      </header>

      <div className="space-y-4 sm:space-y-6">

        <Section tag="Topic (c)" title="Routing and Controllers">
          <p>
            A route is a mapping of an HTTP verb plus a URL to a piece of code. Keeping that code
            in a controller instead of a closure separates the &quot;address&quot; of a feature
            from its behaviour, so request handling stays testable and the route file stays a
            readable table of contents for the app.
          </p>
          <Code>{`use App\\Http\\Controllers\\TaskController;

Route::get('/tasks', [TaskController::class, 'index']);
Route::post('/tasks', [TaskController::class, 'store']);

// Route parameters are injected into the action
Route::get('/tasks/{task}', [TaskController::class, 'show']);

// Grouping shares prefixes and middleware
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});`}</Code>
          <p>
            <strong className="text-foreground">Why it matters:</strong> resource controllers give
            you the seven conventional actions (index, create, store, show, edit, update, destroy),
            and middleware attaches cross-cutting concerns — authentication, throttling, CSRF —
            without touching action bodies. Responses carry status codes that describe the outcome:
            200 for a successful read, 201 for a created resource, 422 for validation failure.
          </p>
          <Terms
            items={["Route", "HTTP verb", "Controller", "Route parameter", "Resource controller", "Middleware"]}
          />
          <p className="text-xs">
            <strong className="text-foreground">Lab 3</strong> — define routes and controller
            actions, then confirm each one responds before adding data.
          </p>
        </Section>

        <Section tag="Topic (d)" title="Database and Eloquent">
          <p>
            Migrations are version control for the schema: each migration file describes a change
            in PHP, so any teammate can rebuild the same tables with{" "}
            <code className="text-accent">php artisan migrate</code>. Eloquent is the ORM layer —
            one model class per table, each row an object, relationships expressed as methods
            rather than joins written by hand.
          </p>
          <Code>{`// php artisan make:model Task -m
Schema::create('tasks', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->boolean('completed')->default(false);
    $table->timestamps();
});

class Task extends Model
{
    protected $fillable = ['title', 'completed'];
}

Task::latest()->get();                 // read
Task::create($request->validated());   // create
$task->update(['completed' => true]);  // update
$task->delete();                       // delete`}</Code>
          <p>
            <strong className="text-foreground">The safety rule:</strong>{" "}
            <code className="text-accent">$fillable</code> whitelists mass-assignable columns.
            Without it, a crafted request could set columns you never intended to expose — the
            mass-assignment vulnerability. Validation happens before persistence, and the validated
            array is what you hand to Eloquent.
          </p>
          <Terms
            items={["Migration", "Schema", "Model", "Eloquent ORM", "CRUD", "Mass assignment", "$fillable"]}
          />
          <p className="text-xs">
            <strong className="text-foreground">Lab 4</strong> — generate a model with its
            migration, run it, then perform each CRUD operation through the model.
          </p>
        </Section>

        <Section tag="Topic (e)" title="Inertia and Frontend Integration">
          <p>
            Inertia.js removes the API layer between a Laravel backend and a React frontend. There
            is no separate REST contract to maintain and no client-side router to keep in sync: the
            controller names a page component and passes it props, and Inertia swaps that component
            in on the client. You get single-page-app navigation with server-driven routing and
            data — a monolithic architecture that still feels like an SPA.
          </p>
          <Code>{`// Controller decides the component and the props
public function index()
{
    return Inertia::render('Tasks/Index', [
        'tasks' => Task::latest()->get(),
    ]);
}

// resources/js/Pages/Tasks/Index.jsx
export default function Index({ tasks }) {
  const { data, setData, post, reset } = useForm({ title: '' });

  function addTask(e) {
    e.preventDefault();
    post('/tasks', { onSuccess: () => reset('title') });
  }
  // ...
}`}</Code>
          <p>
            <strong className="text-foreground">How the pieces line up:</strong> the adapter
            (<code className="text-accent">@inertiajs/react</code>) resolves the page name to a
            component file; <code className="text-accent">useForm</code> submits with the same
            validation and redirect behaviour a Blade form would have, so a failed request
            repopulates <code className="text-accent">errors</code> without a page reload; a
            successful one re-renders the page with fresh props.
          </p>
          <Terms
            items={["Inertia.js", "Page component", "Props", "Server-driven SPA", "Adapter", "Monolithic architecture"]}
          />
          <p className="text-xs">
            <strong className="text-foreground">Lab 5</strong> — integrate Inertia and render a
            React component with data supplied by the Laravel backend.
          </p>
        </Section>

        <Section tag="Walkthrough" title="Task Manager — the three stages">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <strong className="text-foreground">Routing &amp; controllers:</strong> generate{" "}
              <code className="text-accent">TaskController</code>, register{" "}
              <code className="text-accent">GET /tasks</code>, return a placeholder JSON response
              to prove requests reach the backend.
            </li>
            <li>
              <strong className="text-foreground">Database &amp; Eloquent:</strong> add the tasks
              migration and model, then replace the placeholder with{" "}
              <code className="text-accent">Task::latest()-&gt;get()</code> and a validated{" "}
              <code className="text-accent">store</code>.
            </li>
            <li>
              <strong className="text-foreground">Inertia:</strong> swap the JSON return for{" "}
              <code className="text-accent">Inertia::render('Tasks/Index', [...])</code> and build
              the React page that lists tasks and posts new ones.
            </li>
          </ol>
          <p>
            The <code className="text-accent">laravel/</code> folder in this project contains that
            finished code — routes, controller, model, migration, Inertia page, entry point and
            root Blade template — ready to drop into a fresh Laravel install.
          </p>
        </Section>

        <Section tag="Assessment" title="CILO alignment">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">CILO 1</strong> — the route table and controller
              actions document the app&apos;s functional requirements and execution paths; Inertia
              is the emerging-technology library API in play.
            </li>
            <li>
              <strong className="text-foreground">CILO 2</strong> — Laravel&apos;s conventions
              (resource controllers, validation rules, <code className="text-accent">$fillable</code>
              ) are the coding standards that deliver reliability and robustness.
            </li>
            <li>
              <strong className="text-foreground">CILO 3</strong> — controller actions are small,
              named units, which is exactly what makes them inspectable and unit-testable in a team
              review.
            </li>
          </ul>
        </Section>
      </div>
    </main>
  );
}
