import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ExperiencePage } from "../../../src/pages/experience/ExperiencePage";
import * as experienceList from "../../../src/hooks/experience/useExperienceList";
import * as experienceForm from "../../../src/hooks/experience/useExperienceForm";

vi.mock("antd", () => {
  const FormItem = ({ children, rules, label }: any) => {
    if (rules) {
      rules.forEach((rule: any) => {
        if (typeof rule.validator === "function") {
          Promise.resolve(rule.validator({}, [])).catch(() => undefined);
        }
      });
    }
    return (
      <div>
        {label ? <span>{label}</span> : null}
        {children}
      </div>
    );
  };

  const Form = ({ children, onFinish }: any) => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onFinish?.({});
      }}
    >
      {children}
    </form>
  );
  Form.Item = FormItem;
  Form.useForm = () => [{}];
  Form.useWatch = () => [];

  const Input = (props: any) => <input {...props} />;
  Input.TextArea = (props: any) => <textarea {...props} />;

  return {
    Button: ({ children, onClick, htmlType, type }: any) => (
      <button type={htmlType ?? "button"} onClick={onClick} data-type={type}>
        {children}
      </button>
    ),
    Form,
    Input,
    DatePicker: ({ children }: any) => <div>{children}</div>,
    Row: ({ children }: any) => <div>{children}</div>,
    Col: ({ children }: any) => <div>{children}</div>,
    Table: ({ dataSource = [], columns = [] }: any) => (
      <div>
        {dataSource.map((record: any) => (
          <div key={record.id}>
            {columns.map((column: any, index: number) => (
              <div key={`${record.id}-${index}`}>
                {column.render
                  ? column.render(record[column.dataIndex], record)
                  : record[column.dataIndex]}
              </div>
            ))}
          </div>
        ))}
      </div>
    ),
    Popconfirm: ({ children, onConfirm }: any) => (
      <div>
        {children}
        {onConfirm && (
          <button onClick={onConfirm} data-testid="popconfirm-confirm">
            Confirm
          </button>
        )}
      </div>
    ),
    Tag: ({ children }: any) => <span>{children}</span>,
    Typography: {
      Text: ({ children }: any) => <span>{children}</span>,
      Title: ({ children, level }: any) => (
        <h1 data-level={level}>{children}</h1>
      ),
    },
    theme: {
      useToken: () => ({
        token: {
          colorBgContainer: "#fff",
          colorText: "#000",
        },
      }),
    },
    Layout: {
      Header: ({ children, style }: any) => (
        <header style={style}>{children}</header>
      ),
    },
    Avatar: ({ src, alt }: any) => <img src={src} alt={alt} />,
    Space: ({ children }: any) => <div>{children}</div>,
    Switch: ({ checked, onChange }: any) => (
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
    ),
  };
});

vi.mock("../../../src/hooks/experience/useExperienceList");
vi.mock("../../../src/hooks/experience/useExperienceForm");
vi.mock("../../../src/components", async () => {
  const actual = await vi.importActual<typeof import("../../../src/components")>(
    "../../../src/components",
  );
  return {
    ...actual,
    SkillSonSelector: () => <div data-testid="skill-son-selector" />,
  };
});

describe("ExperiencePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (experienceList.useExperienceList as unknown as vi.Mock).mockReturnValue({
      data: [
        {
          id: 1,
          company: "Acme",
          yearStart: "2022-01-01",
          yearEnd: "2022-12-31",
        },
      ],
      isLoading: false,
      isBusy: false,
      handleDelete: vi.fn(),
      reloadExperiences: vi.fn(),
      setSuccessOnReload: vi.fn(),
    });
    (experienceForm.useExperienceForm as unknown as vi.Mock).mockReturnValue({
      form: {
        getFieldsValue: vi.fn(() => ({})),
        setFieldsValue: vi.fn(),
        resetFields: vi.fn(),
      },
      isLoading: false,
      isSaving: false,
      selectedSkillSons: [],
      handleSkillSonsSelect: vi.fn(),
      handleSubmit: vi.fn().mockResolvedValue(true),
    });
  });

  it("renders the list view with data", () => {
    render(<ExperiencePage />);

    expect(screen.getByText("Experiencias")).toBeInTheDocument();
    expect(screen.getByText("Acme")).toBeInTheDocument();
  });

  it(
    "can navigate to create view and back",
    async () => {
    const user = userEvent.setup();
    render(<ExperiencePage />);

    await user.click(
      screen.getByRole("button", { name: /crear experiencia/i }),
    );
    expect(
      screen.getByRole("heading", { name: /crear experiencia/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /volver/i }));
    expect(screen.getByText("Experiencias")).toBeInTheDocument();
    },
    15000,
  );
});
