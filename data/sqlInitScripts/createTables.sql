
CREATE TABLE "public"."users" (
    "id" integer GENERATED ALWAYS AS IDENTITY,
    "key " text NOT NULL,
    "value" jsonb NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("key ")
);


CREATE TABLE "public"."works" (
    "id" integer GENERATED ALWAYS AS IDENTITY,
    "value" jsonb NOT NULL,
    PRIMARY KEY ("id")
);
ALTER TABLE "public"."works" ADD COLUMN "authorId" text NOT NULL;
