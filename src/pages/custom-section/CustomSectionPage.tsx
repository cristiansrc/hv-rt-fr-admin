import {
  Button,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Switch,
  Table,
  Tag,
} from "antd";
import { useCallback, useMemo, useState } from "react";
import { LoadingBlock, RichTextEditor, SectionHeader } from "../../components";
import {
  useCustomSectionForm,
  type CustomSectionFormValues,
} from "../../hooks/custom-section/useCustomSectionForm";
import { useCustomSectionList } from "../../hooks/custom-section/useCustomSectionList";
import type { CustomSectionResponse } from "../../api";

type CustomSectionView = "list" | "create" | "edit";

interface CustomSectionFormProps {
  mode: "create" | "edit";
  customSectionId?: number;
  onBack: () => void;
  onSaved: (message: string) => void;
}

const CustomSectionForm = ({
  mode,
  customSectionId,
  onBack,
  onSaved,
}: CustomSectionFormProps) => {
  const { form, isLoading, isSaving, handleSubmit } = useCustomSectionForm({
    mode,
    customSectionId,
    onSuccess: onSaved,
  });

  const handleFinish = useCallback(
    async (values: CustomSectionFormValues) => {
      const success = await handleSubmit(values);
      if (success) {
        onBack();
      }
    },
    [handleSubmit, onBack],
  );

  return (
    <div className="custom-section-panel">
      <SectionHeader
        className="custom-section-header"
        title={
          mode === "edit"
            ? "Editar sección personalizada"
            : "Crear sección personalizada"
        }
        action={{
          label: "Volver",
          onClick: onBack,
        }}
      />
      {isLoading ? (
        <LoadingBlock
          className="custom-section-loading"
          tip="Cargando sección personalizada..."
        />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
          className="custom-section-form"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="title"
                label="Título"
                rules={[{ required: true, message: "Ingresa el título" }]}
              >
                <Input placeholder="Título" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="titleEng"
                label="Título (inglés)"
                rules={[
                  { required: true, message: "Ingresa el título en inglés" },
                ]}
              >
                <Input placeholder="Title in English" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="content" label="Contenido">
                <RichTextEditor placeholder="Contenido" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="contentEng" label="Contenido (inglés)">
                <RichTextEditor placeholder="Content in English" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="summaryPdf" label="Resumen PDF">
                <Input.TextArea placeholder="Resumen PDF" rows={4} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="summaryPdfEng" label="Resumen PDF (inglés)">
                <Input.TextArea placeholder="Summary PDF in English" rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="visible"
                label="Visible"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="basic-data-actions">
            <Button type="primary" htmlType="submit" loading={isSaving}>
              {mode === "edit"
                ? "Actualizar sección personalizada"
                : "Guardar sección personalizada"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export const CustomSectionPage = () => {
  const [view, setView] = useState<CustomSectionView>("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const {
    data,
    isLoading,
    isBusy,
    handleDelete,
    reloadCustomSections,
    setSuccessOnReload,
  } = useCustomSectionList();

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
      reloadCustomSections();
    },
    [reloadCustomSections, setSuccessOnReload],
  );

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
      },
      {
        title: "Título",
        dataIndex: "title",
      },
      {
        title: "Estado",
        dataIndex: "visible",
        render: (visible: boolean) => (
          <Tag color={visible ? "green" : "default"}>
            {visible ? "Visible" : "Oculto"}
          </Tag>
        ),
      },
      {
        title: "Acciones",
        dataIndex: "actions",
        render: (_: unknown, record: CustomSectionResponse) => (
          <div className="custom-section-actions">
            <Button type="link" onClick={() => handleEdit(record.id)}>
              Editar
            </Button>
            <Popconfirm
              title={`¿Está seguro de eliminar la sección personalizada con id ${record.id}?`}
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
      <CustomSectionForm
        mode="create"
        onBack={handleBackToList}
        onSaved={handleSaved}
      />
    );
  }

  if (view === "edit" && editingId) {
    return (
      <CustomSectionForm
        mode="edit"
        customSectionId={editingId}
        onBack={handleBackToList}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <div className="custom-section-panel">
      <SectionHeader
        className="custom-section-header"
        title="Secciones Personalizadas"
        action={{
          label: "Crear sección personalizada",
          onClick: handleCreate,
        }}
      />
      {isBusy && !isLoading && (
        <LoadingBlock
          className="custom-section-busy-overlay"
          tip="Procesando..."
        />
      )}
      {isLoading ? (
        <LoadingBlock
          className="custom-section-loading"
          tip="Cargando secciones personalizadas..."
        />
      ) : (
        <Table rowKey="id" columns={columns} dataSource={data ?? []} />
      )}
    </div>
  );
};
