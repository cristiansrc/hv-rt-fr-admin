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
  useLanguageForm,
  type LanguageFormValues,
} from "../../hooks/language/useLanguageForm";
import { useLanguageList } from "../../hooks/language/useLanguageList";
import type { LanguageResponse } from "../../api";

type LanguageView = "list" | "create" | "edit";

interface LanguageFormProps {
  mode: "create" | "edit";
  languageId?: number;
  onBack: () => void;
  onSaved: (message: string) => void;
}

const LanguageForm = ({ mode, languageId, onBack, onSaved }: LanguageFormProps) => {
  const { form, isLoading, isSaving, handleSubmit } = useLanguageForm({
    mode,
    languageId,
    onSuccess: onSaved,
  });

  const handleFinish = useCallback(
    async (values: LanguageFormValues) => {
      const success = await handleSubmit(values);
      if (success) {
        onBack();
      }
    },
    [handleSubmit, onBack],
  );

  return (
    <div className="language-panel">
      <SectionHeader
        className="language-header"
        title={mode === "edit" ? "Editar idioma" : "Crear idioma"}
        action={{
          label: "Volver",
          onClick: onBack,
        }}
      />
      {isLoading ? (
        <LoadingBlock className="language-loading" tip="Cargando idioma..." />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
          className="language-form"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="language"
                label="Idioma"
                rules={[{ required: true, message: "Ingresa el idioma" }]}
              >
                <Input placeholder="Idioma" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="languageEng"
                label="Idioma (inglés)"
                rules={[
                  { required: true, message: "Ingresa el idioma en inglés" },
                ]}
              >
                <Input placeholder="Language in English" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="readingLevel"
                label="Nivel de lectura"
                rules={[
                  { required: true, message: "Ingresa el nivel de lectura" },
                ]}
              >
                <Input placeholder="Nivel de lectura" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="writingLevel"
                label="Nivel de escritura"
                rules={[
                  { required: true, message: "Ingresa el nivel de escritura" },
                ]}
              >
                <Input placeholder="Nivel de escritura" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="speakingLevel"
                label="Nivel de habla"
                rules={[
                  { required: true, message: "Ingresa el nivel de habla" },
                ]}
              >
                <Input placeholder="Nivel de habla" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="basic-data-actions">
            <Button type="primary" htmlType="submit" loading={isSaving}>
              {mode === "edit" ? "Actualizar idioma" : "Guardar idioma"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export const LanguagePage = () => {
  const [view, setView] = useState<LanguageView>("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const {
    data,
    isLoading,
    isBusy,
    handleDelete,
    reloadLanguages,
    setSuccessOnReload,
  } = useLanguageList();

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
      reloadLanguages();
    },
    [reloadLanguages, setSuccessOnReload],
  );

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
      },
      {
        title: "Idioma",
        dataIndex: "language",
      },
      {
        title: "Lectura",
        dataIndex: "readingLevel",
      },
      {
        title: "Escritura",
        dataIndex: "writingLevel",
      },
      {
        title: "Habla",
        dataIndex: "speakingLevel",
      },
      {
        title: "Acciones",
        dataIndex: "actions",
        render: (_: unknown, record: LanguageResponse) => (
          <div className="language-actions">
            <Button type="link" onClick={() => handleEdit(record.id)}>
              Editar
            </Button>
            <Popconfirm
              title={`¿Está seguro de eliminar el idioma con id ${record.id}?`}
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
      <LanguageForm
        mode="create"
        onBack={handleBackToList}
        onSaved={handleSaved}
      />
    );
  }

  if (view === "edit" && editingId) {
    return (
      <LanguageForm
        mode="edit"
        languageId={editingId}
        onBack={handleBackToList}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <div className="language-panel">
      <SectionHeader
        className="language-header"
        title="Idiomas"
        action={{
          label: "Crear idioma",
          onClick: handleCreate,
        }}
      />
      {isBusy && !isLoading && (
        <LoadingBlock
          className="language-busy-overlay"
          tip="Procesando..."
        />
      )}
      {isLoading ? (
        <LoadingBlock
          className="language-loading"
          tip="Cargando idiomas..."
        />
      ) : (
        <Table rowKey="id" columns={columns} dataSource={data ?? []} />
      )}
    </div>
  );
};
