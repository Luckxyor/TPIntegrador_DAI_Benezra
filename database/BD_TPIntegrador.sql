--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.0

-- Started on 2025-07-14 11:57:53

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

--CREATE SCHEMA public;


--ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4850 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

--COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16496)
-- Name: event_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_categories (
    id integer NOT NULL,
    name character varying(100),
    display_order smallint
);


ALTER TABLE public.event_categories OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16540)
-- Name: event_enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_enrollments (
    id integer NOT NULL,
    id_event integer,
    id_user integer,
    description text,
    registration_date_time timestamp without time zone,
    attended boolean,
    observations text,
    rating smallint
);


ALTER TABLE public.event_enrollments OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16501)
-- Name: event_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_locations (
    id integer NOT NULL,
    id_location integer,
    name character varying(100),
    full_address text,
    max_capacity integer,
    latitude numeric(9,6),
    longitude numeric(9,6),
    id_creator_user integer
);


ALTER TABLE public.event_locations OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16562)
-- Name: event_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_tags (
    id integer NOT NULL,
    id_event integer,
    id_tag integer
);


ALTER TABLE public.event_tags OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16518)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    name character varying(100),
    description text,
    id_event_category integer,
    id_event_location integer,
    start_date timestamp without time zone,
    duration_in_minutes smallint,
    price numeric(10,2),
    enabled_for_enrollment boolean,
    max_assistance integer,
    id_creator_user integer
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16486)
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    name character varying(100),
    id_province integer,
    latitude numeric(9,6),
    longitude numeric(9,6)
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16481)
-- Name: provinces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provinces (
    id integer NOT NULL,
    name character varying(100),
    full_name character varying(150),
    latitude numeric(9,6),
    longitude numeric(9,6),
    display_order smallint
);


ALTER TABLE public.provinces OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16557)
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(50)
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16476)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    username character varying(30),
    password character varying(100)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4839 (class 0 OID 16496)
-- Dependencies: 218
-- Data for Name: event_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_categories VALUES (1, 'Conciertos', 1);
INSERT INTO public.event_categories VALUES (2, 'Charlas', 2);
INSERT INTO public.event_categories VALUES (3, 'Talleres', 3);
INSERT INTO public.event_categories VALUES (4, 'Ferias', 4);
INSERT INTO public.event_categories VALUES (5, 'Deportes', 5);


--
-- TOC entry 4842 (class 0 OID 16540)
-- Dependencies: 221
-- Data for Name: event_enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_enrollments VALUES (1, 1, 2, 'Fan de rock nacional', '2025-07-01 10:00:00', true, 'Todo excelente', 5);
INSERT INTO public.event_enrollments VALUES (2, 2, 3, 'Interesado en IA', '2025-07-02 11:30:00', false, '', NULL);
INSERT INTO public.event_enrollments VALUES (3, 3, 4, 'Me interesa la cerámica', '2025-07-03 14:45:00', true, 'Muy bueno', 4);
INSERT INTO public.event_enrollments VALUES (4, 4, 5, 'Soy escritor independiente', '2025-07-04 09:15:00', false, '', NULL);
INSERT INTO public.event_enrollments VALUES (5, 5, 1, 'Jugador federado', '2025-07-05 16:20:00', true, 'Excelente organización', 5);


--
-- TOC entry 4840 (class 0 OID 16501)
-- Dependencies: 219
-- Data for Name: event_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_locations VALUES (1, 1, 'Centro Cultural Palermo', 'Av. Santa Fe 4201', 300, -34.578400, -58.426900, 1);
INSERT INTO public.event_locations VALUES (2, 2, 'Teatro Argentino', 'Calle 51 N° 702', 1000, -34.921400, -57.954400, 2);
INSERT INTO public.event_locations VALUES (3, 3, 'Paseo del Buen Pastor', 'Hipólito Yrigoyen 325', 500, -31.429100, -64.188800, 3);
INSERT INTO public.event_locations VALUES (4, 4, 'Complejo Lavardén', 'Mendoza 1085', 600, -32.944200, -60.650500, 4);
INSERT INTO public.event_locations VALUES (5, 5, 'Auditorio Ángel Bustelo', 'Av. Peltier 611', 1200, -32.917400, -68.857500, 5);


--
-- TOC entry 4844 (class 0 OID 16562)
-- Dependencies: 223
-- Data for Name: event_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_tags VALUES (1, 1, 5);
INSERT INTO public.event_tags VALUES (2, 2, 1);
INSERT INTO public.event_tags VALUES (3, 2, 4);
INSERT INTO public.event_tags VALUES (4, 3, 2);
INSERT INTO public.event_tags VALUES (5, 4, 3);


--
-- TOC entry 4841 (class 0 OID 16518)
-- Dependencies: 220
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.events VALUES (1, 'Recital de Rock Nacional', 'Concierto con bandas argentinas', 1, 1, '2025-08-10 20:00:00', 120, 5000.00, true, 300, 1);
INSERT INTO public.events VALUES (2, 'Charla sobre Inteligencia Artificial', 'Panel con expertos en IA', 2, 2, '2025-09-05 18:00:00', 90, 0.00, true, 1000, 2);
INSERT INTO public.events VALUES (3, 'Taller de Cerámica', 'Aprendé técnicas básicas', 3, 3, '2025-07-25 15:00:00', 180, 3500.00, true, 50, 3);
INSERT INTO public.events VALUES (4, 'Feria del Libro Independiente', 'Exposición de editoriales autogestionadas', 4, 4, '2025-10-12 11:00:00', 360, 0.00, true, 600, 4);
INSERT INTO public.events VALUES (5, 'Torneo de Ajedrez', 'Competencia abierta por categorías', 5, 5, '2025-08-20 09:00:00', 480, 1000.00, true, 200, 5);


--
-- TOC entry 4838 (class 0 OID 16486)
-- Dependencies: 217
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.locations VALUES (1, 'Palermo', 1, -34.578400, -58.426900);
INSERT INTO public.locations VALUES (2, 'La Plata', 2, -34.921400, -57.954400);
INSERT INTO public.locations VALUES (3, 'Nueva Córdoba', 3, -31.429100, -64.188800);
INSERT INTO public.locations VALUES (4, 'Rosario Centro', 4, -32.944200, -60.650500);
INSERT INTO public.locations VALUES (5, 'Godoy Cruz', 5, -32.917400, -68.857500);


--
-- TOC entry 4837 (class 0 OID 16481)
-- Dependencies: 216
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.provinces VALUES (1, 'CABA', 'Ciudad Autónoma de Buenos Aires', -34.603700, -58.381600, 1);
INSERT INTO public.provinces VALUES (2, 'Buenos Aires', 'Provincia de Buenos Aires', -34.921400, -57.954400, 2);
INSERT INTO public.provinces VALUES (3, 'Córdoba', 'Provincia de Córdoba', -31.420100, -64.188800, 3);
INSERT INTO public.provinces VALUES (4, 'Santa Fe', 'Provincia de Santa Fe', -31.633300, -60.700000, 4);
INSERT INTO public.provinces VALUES (5, 'Mendoza', 'Provincia de Mendoza', -32.889500, -68.845800, 5);


--
-- TOC entry 4843 (class 0 OID 16557)
-- Dependencies: 222
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tags VALUES (1, 'Gratuito');
INSERT INTO public.tags VALUES (2, 'Con inscripción previa');
INSERT INTO public.tags VALUES (3, 'Para toda la familia');
INSERT INTO public.tags VALUES (4, 'Con certificado');
INSERT INTO public.tags VALUES (5, 'Presencial');


--
-- TOC entry 4836 (class 0 OID 16476)
-- Dependencies: 215
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'Juan', 'Pérez', 'juanp', 'hashedpass1');
INSERT INTO public.users VALUES (2, 'María', 'Gómez', 'mariag', 'hashedpass2');
INSERT INTO public.users VALUES (3, 'Lucas', 'Fernández', 'lucasf', 'hashedpass3');
INSERT INTO public.users VALUES (4, 'Sofía', 'Martínez', 'sofim', 'hashedpass4');
INSERT INTO public.users VALUES (5, 'Diego', 'López', 'diegol', 'hashedpass5');


--
-- TOC entry 4672 (class 2606 OID 16500)
-- Name: event_categories event_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_categories
    ADD CONSTRAINT event_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4678 (class 2606 OID 16546)
-- Name: event_enrollments event_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_pkey PRIMARY KEY (id);


--
-- TOC entry 4674 (class 2606 OID 16507)
-- Name: event_locations event_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT event_locations_pkey PRIMARY KEY (id);


--
-- TOC entry 4682 (class 2606 OID 16566)
-- Name: event_tags event_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_pkey PRIMARY KEY (id);


--
-- TOC entry 4676 (class 2606 OID 16524)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- TOC entry 4670 (class 2606 OID 16490)
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- TOC entry 4668 (class 2606 OID 16485)
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (id);


--
-- TOC entry 4680 (class 2606 OID 16561)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 4666 (class 2606 OID 16480)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4689 (class 2606 OID 16547)
-- Name: event_enrollments fk_event_enrollments_event; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT fk_event_enrollments_event FOREIGN KEY (id_event) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4690 (class 2606 OID 16552)
-- Name: event_enrollments fk_event_enrollments_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT fk_event_enrollments_user FOREIGN KEY (id_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4684 (class 2606 OID 16513)
-- Name: event_locations fk_event_locations_creator; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT fk_event_locations_creator FOREIGN KEY (id_creator_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4685 (class 2606 OID 16508)
-- Name: event_locations fk_event_locations_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT fk_event_locations_location FOREIGN KEY (id_location) REFERENCES public.locations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4691 (class 2606 OID 16567)
-- Name: event_tags fk_event_tags_event; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT fk_event_tags_event FOREIGN KEY (id_event) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4692 (class 2606 OID 16572)
-- Name: event_tags fk_event_tags_tag; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT fk_event_tags_tag FOREIGN KEY (id_tag) REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4686 (class 2606 OID 16525)
-- Name: events fk_events_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_events_category FOREIGN KEY (id_event_category) REFERENCES public.event_categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4687 (class 2606 OID 16535)
-- Name: events fk_events_creator; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_events_creator FOREIGN KEY (id_creator_user) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4688 (class 2606 OID 16530)
-- Name: events fk_events_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_events_location FOREIGN KEY (id_event_location) REFERENCES public.event_locations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4683 (class 2606 OID 16491)
-- Name: locations fk_locations_province; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT fk_locations_province FOREIGN KEY (id_province) REFERENCES public.provinces(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2025-07-14 11:57:53

--
-- PostgreSQL database dump complete
--

