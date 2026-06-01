import {
  Button,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Table,
} from "antd";
import { useCallback, useMemo, useState } from "react";
import { LoadingBlock, SectionHeader } from "../../components";
import {
  useReferenceForm,
  type ReferenceFormValues,
} from "../../hooks/reference/useReferenceForm";
import { useReferenceList } from "../../hooks/reference/useReferenceList";
import type { ReferenceResponse } from "../../api";

type ReferenceView = "list" | "create" | "edit";

interface ReferenceFormProps {
  mode: "create" | "edit";
  referenceId?: number;
  onBack: () => void;
  onSaved: (message: string) => void;
}

const ReferenceForm = ({
  mode,
  referenceId,
  onBack,
  onSaved,
}: ReferenceFormProps) => {
  const { form, isLoading, isSaving, handleSubmit } = useReferenceForm({
    mode,
    referenceId,
    onSuccess: onSaved,
  });

  const handleFinish = useCallback(
    async (values: ReferenceFormValues) => {
      const success = await handleSubmit(values);
      if (success) {
        onBack();
      }
    },
    [handleSubmit, onBack],
  );

  return (
    <div className="reference-panel">
      <SectionHeader
        className="reference-header"
        title={mode === "edit" ? "Editar referencia" : "Crear referencia"}
        action={{
          label: "Volver",
          onClick: onBack,
        }}
      />
      {isLoading ? (
        <LoadingBlock
          className="reference-loading"
          tip="Cargando referencia..."
        />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
          className="reference-form"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="fullName"
                label="Nombre completo"
                rules={[
                  { required: true, message: "Ingresa el nombre completo" },
                ]}
              >
                <Input placeholder="Nombre completo" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="position"
                label="Posición"
                rules={[{ required: true, message: "Ingresa la posición" }]}
              >
                <Input placeholder="Posición" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="company" label="Empresa">
                <Input placeholder="Empresa" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="companyEng" label="Empresa (inglés)">
                <Input placeholder="Company in English" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="email" label="Correo electrónico">
                <Input placeholder="Correo electrónico" type="email" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="phone" label="Teléfono">
                <Input placeholder="Teléfono" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="relationship" label="Relación">
                <Input placeholder="Relación" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="relationshipEng" label="Relación (inglés)">
                <Input placeholder="Relationship in English" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="basic-data-actions">
            <Button type="primary" htmlType="submit" loading={isSaving}>
              {mode === "edit" ? "Actualizar referencia" : "Guardar referencia"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export const ReferencePage = () => {
  const [view, setView] = useState<ReferenceView>("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const {
    data,
    isLoading,
    isBusy,
    handleDelete,
    reloadReferences,
    setSuccessOnReload,
  } = useReferenceList();

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
      reloadReferences();
    },
    [reloadReferences, setSuccessOnReload],
  );

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
      },
      {
        title: "Nombre",
        dataIndex: "fullName",
      },
      {
        title: "Posición",
        dataIndex: "position",
      },
      {
        title: "Empresa",
        dataIndex: "company",
      },
      {
        title: "Acciones",
        dataIndex: "actions",
        render: (_: unknown, record: ReferenceResponse) => (
          <div className="reference-actions">
            <Button type="link" onClick={() => handleEdit(record.id)}>
              Editar
            </Button>
            <Popconfirm
              title={`¿Está seguro de eliminar la referencia con id ${record.id}?`}
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
      <ReferenceForm
        mode="create"
        onBack={handleBackToList}
        onSaved={handleSaved}
      />
    );
  }

  if (view === "edit" && editingId) {
    return (
      <ReferenceForm
        mode="edit"
        referenceId={editingId}
        onBack={handleBackToList}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <div className="reference-panel">
      <SectionHeader
        className="reference-header"
        title="Referencias"
        action={{
          label: "Crear referencia",
          onClick: handleCreate,
        }}
      />
      {isBusy && !isLoading && (
        <LoadingBlock
          className="reference-busy-overlay"
          tip="Procesando..."
        />
      )}
      {isLoading ? (
        <LoadingBlock
          className="reference-loading"
          tip="Cargando referencias..."
        />
      ) : (
        <Table rowKey="id" columns={columns} dataSource={data ?? []} />
      )}
    </div>
  );
};
