import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Row,
  Table,
} from "antd";
import { useCallback, useMemo, useState } from "react";
import { LoadingBlock, RichTextEditor, SectionHeader } from "../../components";
import { BASIC_DATA_DATE_FORMAT } from "../../config/basic-data-config";
import {
  useCertificationForm,
  type CertificationFormValues,
} from "../../hooks/certification/useCertificationForm";
import { useCertificationList } from "../../hooks/certification/useCertificationList";
import type { CertificationResponse } from "../../api";

type CertificationView = "list" | "create" | "edit";

interface CertificationFormProps {
  mode: "create" | "edit";
  certificationId?: number;
  onBack: () => void;
  onSaved: (message: string) => void;
}

const CertificationForm = ({
  mode,
  certificationId,
  onBack,
  onSaved,
}: CertificationFormProps) => {
  const { form, isLoading, isSaving, handleSubmit } = useCertificationForm({
    mode,
    certificationId,
    onSuccess: onSaved,
  });

  const handleFinish = useCallback(
    async (values: CertificationFormValues) => {
      const success = await handleSubmit(values);
      if (success) {
        onBack();
      }
    },
    [handleSubmit, onBack],
  );

  return (
    <div className="certification-panel">
      <SectionHeader
        className="certification-header"
        title={
          mode === "edit" ? "Editar certificación" : "Crear certificación"
        }
        action={{
          label: "Volver",
          onClick: onBack,
        }}
      />
      {isLoading ? (
        <LoadingBlock
          className="certification-loading"
          tip="Cargando certificación..."
        />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
          className="certification-form"
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
            <Col xs={24} sm={12}>
              <Form.Item
                name="issuingOrganization"
                label="Organización emisora"
                rules={[
                  {
                    required: true,
                    message: "Ingresa la organización emisora",
                  },
                ]}
              >
                <Input placeholder="Organización emisora" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="issuingOrganizationEng"
                label="Organización emisora (inglés)"
                rules={[
                  {
                    required: true,
                    message: "Ingresa la organización emisora en inglés",
                  },
                ]}
              >
                <Input placeholder="Issuing Organization in English" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="issueDate"
                label="Fecha de emisión"
                rules={[
                  {
                    required: true,
                    message: "Selecciona la fecha de emisión",
                  },
                ]}
              >
                <DatePicker
                  format={BASIC_DATA_DATE_FORMAT}
                  inputReadOnly
                  className="certification-date-picker"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="expirationDate" label="Fecha de expiración">
                <DatePicker
                  format={BASIC_DATA_DATE_FORMAT}
                  inputReadOnly
                  className="certification-date-picker"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="verificationUrl" label="URL de verificación">
                <Input placeholder="URL de verificación" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="credentialId" label="ID de credencial">
                <Input placeholder="ID de credencial" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="description" label="Descripción">
                <RichTextEditor placeholder="Descripción" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="descriptionEng" label="Descripción (inglés)">
                <RichTextEditor placeholder="Description in English" />
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
          <Form.Item className="basic-data-actions">
            <Button type="primary" htmlType="submit" loading={isSaving}>
              {mode === "edit"
                ? "Actualizar certificación"
                : "Guardar certificación"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export const CertificationPage = () => {
  const [view, setView] = useState<CertificationView>("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const {
    data,
    isLoading,
    isBusy,
    handleDelete,
    reloadCertifications,
    setSuccessOnReload,
  } = useCertificationList();

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
      reloadCertifications();
    },
    [reloadCertifications, setSuccessOnReload],
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
        title: "Organización",
        dataIndex: "issuingOrganization",
      },
      {
        title: "Acciones",
        dataIndex: "actions",
        render: (_: unknown, record: CertificationResponse) => (
          <div className="certification-actions">
            <Button type="link" onClick={() => handleEdit(record.id)}>
              Editar
            </Button>
            <Popconfirm
              title={`¿Está seguro de eliminar la certificación con id ${record.id}?`}
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
      <CertificationForm
        mode="create"
        onBack={handleBackToList}
        onSaved={handleSaved}
      />
    );
  }

  if (view === "edit" && editingId) {
    return (
      <CertificationForm
        mode="edit"
        certificationId={editingId}
        onBack={handleBackToList}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <div className="certification-panel">
      <SectionHeader
        className="certification-header"
        title="Certificaciones"
        action={{
          label: "Crear certificación",
          onClick: handleCreate,
        }}
      />
      {isBusy && !isLoading && (
        <LoadingBlock
          className="certification-busy-overlay"
          tip="Procesando..."
        />
      )}
      {isLoading ? (
        <LoadingBlock
          className="certification-loading"
          tip="Cargando certificaciones..."
        />
      ) : (
        <Table rowKey="id" columns={columns} dataSource={data ?? []} />
      )}
    </div>
  );
};
