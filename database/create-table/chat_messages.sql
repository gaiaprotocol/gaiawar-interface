CREATE TABLE IF NOT EXISTS "public"."chat_messages" (
    "id" bigint NOT NULL,
    "author" "text" NOT NULL DEFAULT ("auth"."jwt"() ->> 'wallet_address'::text),
    "content" "text",
    "rich" "jsonb",
    "ip_address" "inet" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_edited" boolean,
    "is_deleted" boolean
);

ALTER TABLE "public"."chat_messages" OWNER TO "postgres";
ALTER TABLE "public"."chat_messages" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."chat_messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id");

ALTER TABLE "public"."chat_messages" ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE "public"."chat_messages" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages" TO "service_role";

GRANT ALL ON SEQUENCE "public"."chat_messages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."chat_messages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."chat_messages_id_seq" TO "service_role";

CREATE POLICY "Allow read access for all users" ON public.chat_messages FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON public.chat_messages FOR INSERT TO authenticated 
WITH CHECK (
    author = ("auth"."jwt"() ->> 'wallet_address'::text)
    AND
    (
        ("content" IS NOT NULL AND "content" != '' AND length("content") <= 1000)
        OR
        ("content" IS NULL AND "rich" IS NOT NULL)
    )
);

CREATE POLICY "Allow update for message owner" ON public.chat_messages FOR UPDATE TO authenticated 
USING (author = ("auth"."jwt"() ->> 'wallet_address'::text))
WITH CHECK (
    (
        ("content" IS NOT NULL AND "content" != '' AND length("content") <= 1000)
        OR
        ("content" IS NULL AND "rich" IS NOT NULL)
    )
);

CREATE POLICY "Allow delete for message owner" ON public.chat_messages FOR DELETE TO authenticated 
USING (author = ("auth"."jwt"() ->> 'wallet_address'::text));