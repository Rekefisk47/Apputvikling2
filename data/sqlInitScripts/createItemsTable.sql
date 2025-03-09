
CREATE TABLE "public"."works" (
    "id" integer GENERATED ALWAYS AS IDENTITY,
    "key" text NOT NULL,
    "value" jsonb NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("key")
);

CREATE TABLE "public"."users" (
    "id" integer GENERATED ALWAYS AS IDENTITY,
    "username" text NOT NULL,
    "data" jsonb NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("username")
);

CREATE TABLE "public"."user_work_map" (
    "id" integer GENERATED ALWAYS AS IDENTITY,
    "username" text NOT NULL,
    "works" jsonb NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("username")
);

