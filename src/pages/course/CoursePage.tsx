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
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { LoadingBlock, RichTextEditor, SectionHeader } from "../../components";
import { BASIC_DATA_DATE_FORMAT } from "../../config/basic-data-config";
import {
  useCourseForm,
  type CourseFormValues,
} from "../../hooks/course/useCourseForm";
import { useCourseList } from "../../hooks/course/useCourseList";
import type { CourseResponse } from "../../api";

type CourseView = "list" | "create" | "edit";

interface CourseFormProps {
  mode: "create" | "edit";
  courseId?: number;
  onBack: () => void;
  onSaved: (message: string) => void;
}

const CourseForm = ({ mode, courseId, onBack, onSaved }: CourseFormProps) => {
  const { form, isLoading, isSaving, handleSubmit } = useCourseForm({
    mode,
    courseId,
    onSuccess: onSaved,
  });

  const handleFinish = useCallback(
    async (values: CourseFormValues) => {
      const success = await handleSubmit(values);
      if (success) {
        onBack();
      }
    },
    [handleSubmit, onBack],
  );

  return (
    <div className="course-panel">
      <SectionHeader
        className="course-header"
        title={mode === "edit" ? "Editar curso" : "Crear curso"}
        action={{
          label: "Volver",
          onClick: onBack,
        }}
      />
      {isLoading ? (
        <LoadingBlock className="course-loading" tip="Cargando curso..." />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
          className="course-form"
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
                rules={[{ required: true, message: "Ingresa el nombre en inglés" }]}
              >
                <Input placeholder="Name in English" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="institution"
                label="Institución"
                rules={[{ required: true, message: "Ingresa la institución" }]}
              >
                <Input placeholder="Institución" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="institutionEng"
                label="Institución (inglés)"
                rules={[
                  { required: true, message: "Ingresa la institución en inglés" },
                ]}
              >
                <Input placeholder="Institution in English" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="completionDate"
                label="Fecha de finalización"
                rules={[]}
              >
                <DatePicker
                  format={BASIC_DATA_DATE_FORMAT}
                  inputReadOnly
                  className="course-date-picker"
                />
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
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item name="certificateUrl" label="URL del certificado">
                <Input placeholder="URL del certificado" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="basic-data-actions">
            <Button type="primary" htmlType="submit" loading={isSaving}>
              {mode === "edit" ? "Actualizar curso" : "Guardar curso"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export const CoursePage = () => {
  const [view, setView] = useState<CourseView>("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const {
    data,
    isLoading,
    isBusy,
    handleDelete,
    reloadCourses,
    setSuccessOnReload,
  } = useCourseList();

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
      reloadCourses();
    },
    [reloadCourses, setSuccessOnReload],
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
        title: "Institución",
        dataIndex: "institution",
      },
      {
        title: "Fecha",
        dataIndex: "completionDate",
        render: (date: string) => date ? dayjs(date).format(BASIC_DATA_DATE_FORMAT) : "-",
      },
      {
        title: "Acciones",
        dataIndex: "actions",
        render: (_: unknown, record: CourseResponse) => (
          <div className="course-actions">
            <Button type="link" onClick={() => handleEdit(record.id)}>
              Editar
            </Button>
            <Popconfirm
              title={`¿Está seguro de eliminar el curso con id ${record.id}?`}
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
      <CourseForm
        mode="create"
        onBack={handleBackToList}
        onSaved={handleSaved}
      />
    );
  }

  if (view === "edit" && editingId) {
    return (
      <CourseForm
        mode="edit"
        courseId={editingId}
        onBack={handleBackToList}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <div className="course-panel">
      <SectionHeader
        className="course-header"
        title="Cursos"
        action={{
          label: "Crear curso",
          onClick: handleCreate,
        }}
      />
      {isBusy && !isLoading && (
        <LoadingBlock className="course-busy-overlay" tip="Procesando..." />
      )}
      {isLoading ? (
        <LoadingBlock className="course-loading" tip="Cargando cursos..." />
      ) : (
        <Table rowKey="id" columns={columns} dataSource={data ?? []} />
      )}
    </div>
  );
};
