CREATE TABLE public.tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 255),
  completed BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.tasks_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.tasks_id_seq TO authenticated;
GRANT ALL ON public.tasks TO service_role;
GRANT ALL ON SEQUENCE public.tasks_id_seq TO service_role;

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public demo board can be read by anyone"
  ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Public demo board can be added to by anyone"
  ON public.tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public demo board can be updated by anyone"
  ON public.tasks FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public demo board can be deleted by anyone"
  ON public.tasks FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.tasks (title, completed, priority, created_at) VALUES
  ('Define /tasks route and TaskController@index', true, 'high', now() - interval '1 day'),
  ('Run migration for the tasks table', false, 'normal', now() - interval '1 hour'),
  ('Render Tasks/Index through Inertia with props', false, 'high', now());