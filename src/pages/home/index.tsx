import {
  BookOutlined,
  FileTextOutlined,
  ForkOutlined,
  BranchesOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  SolutionOutlined,
  ReadOutlined,
  HomeOutlined,
  LogoutOutlined,
  PictureOutlined,
  TagOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Layout,
  Menu,
  Space,
  Typography,
} from "antd";
import { useMemo } from "react";
import "../../styles/home.css";
import { BasicDataForm } from "./BasicDataForm";
import { HomePage } from "./HomePage";
import { BlogPage } from "../blog/BlogPage";
import { BlogTypePage } from "../blog-type/BlogTypePage";
import { ExperiencePage } from "../experience/ExperiencePage";
import { EducationPage } from "../education/EducationPage";
import { ImagePage } from "../image/ImagePage";
import { LabelPage } from "../label/LabelPage";
import { SkillPage } from "../skill/SkillPage";
import { SkillSonPage } from "../skill-son/SkillSonPage";
import { SkillTypePage } from "../skill-type/SkillTypePage";
import { VideoPage } from "../video/VideoPage";
import { CertificationPage } from "../certification/CertificationPage";
import { CoursePage } from "../course/CoursePage";
import { CustomSectionPage } from "../custom-section/CustomSectionPage";
import { FuturedProjectPage } from "../futured-project/FuturedProjectPage";
import { LanguagePage } from "../language/LanguagePage";
import { ReferencePage } from "../reference/ReferencePage";
import { MENU_KEYS, useHomePage } from "../../hooks/home/useHomePage";

const { Header, Sider, Content } = Layout;

const MENU_ITEMS: MenuProps["items"] = [
  {
    key: "group-principal",
    label: "Principal",
    type: "submenu",
    icon: <HomeOutlined />,
    children: [
      { key: MENU_KEYS.HOME, label: "Home", icon: <HomeOutlined /> },
      { key: MENU_KEYS.BASIC_DATA, label: "Datos Básicos", icon: <FileTextOutlined /> },
    ],
  },
  {
    key: "group-contenido",
    label: "Contenido",
    type: "submenu",
    icon: <SolutionOutlined />,
    children: [
      { key: MENU_KEYS.EXPERIENCE, label: "Experiencias" },
      { key: MENU_KEYS.EDUCATION, label: "Educación" },
      { key: MENU_KEYS.BLOGS, label: "Blogs" },
      { key: MENU_KEYS.BLOG_TYPE, label: "Tipos de Blog" },
    ],
  },
  {
    key: "group-habilidades",
    label: "Habilidades",
    type: "submenu",
    icon: <BranchesOutlined />,
    children: [
      { key: MENU_KEYS.SKILL_TYPE, label: "Tipos de Habilidad" },
      { key: MENU_KEYS.SKILL, label: "Habilidades" },
      { key: MENU_KEYS.SKILL_SON, label: "Especialidades" },
    ],
  },
  {
    key: "group-multimedia",
    label: "Multimedia",
    type: "submenu",
    icon: <PictureOutlined />,
    children: [
      { key: MENU_KEYS.IMAGES, label: "Imágenes" },
      { key: MENU_KEYS.VIDEO, label: "Videos" },
      { key: MENU_KEYS.LABEL, label: "Labels" },
    ],
  },
  {
    key: "group-formacion",
    label: "Formación Adicional",
    type: "submenu",
    icon: <ReadOutlined />,
    children: [
      { key: MENU_KEYS.COURSES, label: "Cursos" },
      { key: MENU_KEYS.CERTIFICATIONS, label: "Certificaciones" },
      { key: MENU_KEYS.LANGUAGES, label: "Idiomas" },
    ],
  },
  {
    key: "group-proyectos",
    label: "Proyectos",
    type: "submenu",
    icon: <ForkOutlined />,
    children: [
      { key: MENU_KEYS.FUTURED_PROJECTS, label: "Proyectos Destacados" },
    ],
  },
  {
    key: "group-referencias",
    label: "Referencias",
    type: "submenu",
    icon: <BookOutlined />,
    children: [
      { key: MENU_KEYS.REFERENCES, label: "Referencias" },
    ],
  },
  {
    key: "group-custom",
    label: "Secciones Custom",
    type: "submenu",
    icon: <AppstoreOutlined />,
    children: [
      { key: MENU_KEYS.CUSTOM_SECTIONS, label: "Secciones Personalizadas" },
    ],
  },
];

export const Home = () => {
  const { logout, isLogoutLoading, activeMenuKey, setActiveMenuKey } = useHomePage();

  const dropdownContent = useMemo(
    () => (
      <div className="home-user-dropdown-content">
        <div className="home-user-dropdown-name">
          <Typography.Text strong>Cristhiam Reina</Typography.Text>
        </div>
        <Divider className="home-user-dropdown-divider" />
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          block
          loading={isLogoutLoading}
          onClick={() => logout()}
          className="logout-button"
        >
          Salir
        </Button>
      </div>
    ),
    [logout, isLogoutLoading],
  );

  return (
    <Layout className="home-layout">
      <Header className="home-header">
        <Space size="middle" align="center" className="home-header-space">
          <Avatar
            size={40}
            src="https://api.dicebear.com/6.x/thumbs/svg?seed=logo"
          />
          <Typography.Title
            level={4}
            className="home-header-title"
          >
            Currículum Vitae Cristhiam Reina (cristiansrc)
          </Typography.Title>
        </Space>
        <Dropdown
          overlay={dropdownContent}
          trigger={["click"]}
          placement="bottomRight"
          align={{
            points: ["tr", "br"],
            offset: [0, 8],
            overflow: { adjustX: 0, adjustY: 1 },
          }}
          overlayClassName="home-user-dropdown-overlay"
          arrow
        >
          <Avatar
            size={40}
            src="https://i.pravatar.cc/150?img=3"
            className="home-user-avatar"
            aria-label="Abrir menú de usuario"
          />
        </Dropdown>
      </Header>
      <Layout className="home-main">
        <Sider className="home-sider">
          <Menu
            mode="inline"
            theme="light"
            items={MENU_ITEMS}
            className="custom-menu"
            selectedKeys={[activeMenuKey]}
            onSelect={({ key }) => setActiveMenuKey(key)}
            inlineIndent={24}
          />
        </Sider>
        <Content className="home-content">
          {activeMenuKey === MENU_KEYS.HOME ? (
            <HomePage />
          ) : activeMenuKey === MENU_KEYS.BASIC_DATA ? (
            <BasicDataForm />
          ) : activeMenuKey === MENU_KEYS.BLOGS ? (
            <BlogPage />
          ) : activeMenuKey === MENU_KEYS.BLOG_TYPE ? (
            <BlogTypePage />
          ) : activeMenuKey === MENU_KEYS.EXPERIENCE ? (
            <ExperiencePage />
          ) : activeMenuKey === MENU_KEYS.EDUCATION ? (
            <EducationPage />
          ) : activeMenuKey === MENU_KEYS.SKILL ? (
            <SkillPage />
          ) : activeMenuKey === MENU_KEYS.SKILL_TYPE ? (
            <SkillTypePage />
          ) : activeMenuKey === MENU_KEYS.SKILL_SON ? (
            <SkillSonPage />
          ) : activeMenuKey === MENU_KEYS.LABEL ? (
            <LabelPage />
          ) : activeMenuKey === MENU_KEYS.VIDEO ? (
            <VideoPage />
          ) : activeMenuKey === MENU_KEYS.COURSES ? (
            <CoursePage />
          ) : activeMenuKey === MENU_KEYS.CERTIFICATIONS ? (
            <CertificationPage />
          ) : activeMenuKey === MENU_KEYS.LANGUAGES ? (
            <LanguagePage />
          ) : activeMenuKey === MENU_KEYS.REFERENCES ? (
            <ReferencePage />
          ) : activeMenuKey === MENU_KEYS.CUSTOM_SECTIONS ? (
            <CustomSectionPage />
          ) : activeMenuKey === MENU_KEYS.FUTURED_PROJECTS ? (
            <FuturedProjectPage />
          ) : (
            <ImagePage />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};
