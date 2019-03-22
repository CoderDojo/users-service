CREATE VIEW public.cd_v_join_requests AS
 SELECT (x.join_request ->> 'id'::text) AS id,
    x.id AS user_id,
    (x.join_request ->> 'dojoId'::text) AS dojo_id,
    (x.join_request ->> 'userType'::text) AS user_type,
    (x.join_request ->> 'timestamp'::text) AS "timestamp"
   FROM ( SELECT unnest(sys_user.join_requests) AS join_request,
            sys_user.id
           FROM public.sys_user) x;
