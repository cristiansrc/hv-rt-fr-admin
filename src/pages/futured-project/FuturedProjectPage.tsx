import {
  Button,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Table,
  Tag,
  Typography,
} from "antd";
import { useCallback, useMemo, useState } from "react";
import {
  ExperienceSelector,
  ImageSelector,
  LoadingBlock,
  RichTextEditor,
  SectionHeader,
} from "../../components";
import type { FuturedProjectResponse } from "../../api";
import {
  useFuturedProjectForm,
  type FuturedProjectFormValues,
} from "../../hooks/futured-project/useFuturedProjectForm";
import { useFuturedProjectList } from "../../hooks/futured-project/useFuturedProjectList";

type FuturedProjectView = "list" | "create" | "edit";

const { Text } = Typography;

interface FuturedProjectFormProps {
  mode: "create" | "edit";
  futuredProjectId?: number;
  onBack: () => void;
  onSaved: (message: string) => void;
}

const FuturedProjectForm = ({
  mode,
  futuredProjectId,
  onBack,
  onSaved,
}: FuturedProjectFormProps) => {
  const {
    form,
    isLoading,
    isSaving,
    selectedExperience,
    handleExperienceSelect,
    handleSubmit,
  } = useFuturedProjectForm({
    mode,
    futuredProjectId,
    onSuccess: onSaved,
  });

  const handleFinish = useCallback(
    async (values: FuturedProjectFormValues) => {
      const success = await handleSubmit(values);
      if (success) {
        onBack();
      }
    },
    [handleSubmit, onBack],
  );

  return (
    <div className="futured-project-panel">
      <SectionHeader
        className="futured-project-header"
        title={
          mode === "edit"
            ? "Editar proyecto destacado"
            : "Crear proyecto destacado"
        }
        action={{
          label: "Volver",
          onClick: onBack,
        }}
      />
      {isLoading ? (
        <LoadingBlock
          className="futured-project-loading"
          tip="Cargando proyecto destacado..."
        />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
          className="futured-project-form"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Nombre"
                rules={[{ required: true, message: "Ingresa el nombre" }]}
              >
                <Input placeholder="Nombre" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="nameEng"
                label="Nombre (inglés)"
                rules={[
                  { required: true, message: "Ingresa el nombre en inglés" },
                ]}
              >
                <Input placeholder="Name in English" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item label="Experiencia relacionada" required>
                <Form.Item
                  name="experienceId"
                  rules={[
                    { required: true, message: "Selecciona una experiencia" },
                  ]}
                  noStyle
                >
                  <Input type="hidden" />
                </Form.Item>
                <div className="futured-project-experience-selection">
                  {selectedExperience ? (
                    <Tag>{selectedExperience.company} - {selectedExperience.position}</Tag>
                  ) : (
                    <Text type="secondary">Sin experiencia seleccionada</Text>
                  )}
                  <ExperienceSelector
                    selectionMode="single"
                    buttonLabel="Seleccionar experiencia"
                    initialSelectedIds={
                      selectedExperience ? [selectedExperience.id] : undefined
                    }
                    onConfirm={handleExperienceSelect}
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="descriptionShort"
                label="Descripción corta"
                rules={[
                  {
                    required: true,
                    message: "Ingresa la descripción corta",
                  },
                ]}
              >
                <Input.TextArea
                  placeholder="Descripción corta"
                  rows={3}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="descriptionShortEng"
                label="Descripción corta (inglés)"
                rules={[
                  {
                    required: true,
                    message: "Ingresa la descripción corta en inglés",
                  },
                ]}
              >
                <Input.TextArea
                  placeholder="Short description in English"
                  rows={3}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="description"
                label="Descripción"
                rules={[
                  { required: true, message: "Ingresa la descripción" },
                ]}
              >
                <RichTextEditor placeholder="Descripción" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="descriptionEng"
                label="Descripción (inglés)"
                rules={[
                  {
                    required: true,
                    message: "Ingresa la descripción en inglés",
                  },
                ]}
              >
                <RichTextEditor placeholder="Description in English" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="imageListUrlId" label="Imagen de lista">
                <ImageSelector
                  selectionMode="single"
                  buttonLabel="Seleccionar imagen de lista"
                  onConfirm={(selectedIds) => {
                    if (selectedIds.length) {
                      form.setFieldsValue({ imageListUrlId: selectedIds[0] });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="imageUrlId" label="Imagen principal">
                <ImageSelector
                  selectionMode="single"
                  buttonLabel="Seleccionar imagen principal"
                  onConfirm={(selectedIds) => {
                    if (selectedIds.length) {
                      form.setFieldsValue({ imageUrlId: selectedIds[0] });
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="basic-data-actions">
            <Button type="primary" htmlType="submit" loading={isSaving}>
              {mode === "edit"
                ? "Actualizar proyecto destacado"
                : "Guardar proyecto destacado"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export const FuturedProjectPage = () => {
  const [view, setView] = useState<FuturedProjectView>("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const {
    data,
    isLoading,
    isBusy,
    handleDelete,
    reloadFuturedProjects,
    setSuccessOnReload,
  } = useFuturedProjectList();

  const handleCreate = useCallback(() => {
    setEditingId(null);
    setView("create");
  }, []);

  const handleEdit = useCallback((id: number) => {
    setEditingId(id);
    setView("edit");
  }, []);

  const handleBackToList = useCallback(() => {
    setView("list");
  }, []);

  const handleSaved = useCallback(
    (message: string) => {
      setSuccessOnReload(message);
      reloadFuturedProjects();
    },
    [reloadFuturedProjects, setSuccessOnReload],
  );

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
      },
      {
        title: "Nombre",
        dataIndex: "name",
      },
      {
        title: "Empresa",
        dataIndex: ["experience", "company"],
      },
      {
        title: "Acciones",
        dataIndex: "actions",
        render: (_: unknown, record: FuturedProjectResponse) => (
          <div className="futured-project-actions">
            <Button type="link" onClick={() => handleEdit(record.id)}>
              Editar
            </Button>
            <Popconfirm
              title={`¿Está seguro de eliminar el proyecto destacado con id ${record.id}?`}
              onConfirm={() => handleDelete(record.id)}
              okText="Sí"
              cancelText="No"
              okType="danger"
              okButtonProps={{ loading: isBusy }}
              placement="topRight"
            >
              <Button danger type="link">
                Eliminar
              </Button>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [handleDelete, handleEdit, isBusy],
  );

  if (view === "create") {
    return (
      <FuturedProjectForm
        mode="create"
        onBack={handleBackToList}
        onSaved={handleSaved}
      />
    );
  }

  if (view === "edit" && editingId) {
    return (
      <FuturedProjectForm
        mode="edit"
        futuredProjectId={editingId}
        onBack={handleBackToList}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <div className="futured-project-panel">
      <SectionHeader
        className="futured-project-header"
        title="Proyectos Destacados"
        action={{
          label: "Crear proyecto destacado",
          onClick: handleCreate,
        }}
      />
      {isBusy && !isLoading && (
        <LoadingBlock
          className="futured-project-busy-overlay"
          tip="Procesando..."
        />
      )}
      {isLoading ? (
        <LoadingBlock
          className="futured-project-loading"
          tip="Cargando proyectos destacados..."
        />
      ) : (
        <Table rowKey="id" columns={columns} dataSource={data ?? []} />
      )}
    </div>
  );
};
