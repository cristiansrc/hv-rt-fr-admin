import { useCallback, useEffect, useMemo, useState } from "react";
import { getExperiences, type ExperienceResponse } from "../../api";
import { ResourceSelectorModal, type SelectionMode } from "./ResourceSelectorModal";

interface ExperienceSelectorProps {
  selectionMode?: SelectionMode;
  buttonLabel?: string;
  title?: string;
  initialSelectedIds?: number[];
  onConfirm: (selectedIds: number[], selectedRecords: ExperienceResponse[]) => void;
  disabled?: boolean;
}

export const ExperienceSelector = ({
  selectionMode = "single",
  buttonLabel = "Seleccionar experiencia",
  title = "Seleccionar experiencia",
  initialSelectedIds,
  onConfirm,
  disabled,
}: ExperienceSelectorProps) => {
  const [data, setData] = useState<ExperienceResponse[]>([]);
  const [isLoading, setLoading] = useState(false);

  const loadExperiences = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getExperiences();
      setData(response ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  const columns = useMemo(
    () => [
      { title: "ID", dataIndex: "id" },
      { title: "Empresa", dataIndex: "company" },
      { title: "Posición", dataIndex: "position" },
    ],
    [],
  );

  return (
    <ResourceSelectorModal
      title={title}
      buttonLabel={buttonLabel}
      selectionMode={selectionMode}
      tableProps={{
        dataSource: data,
        loading: isLoading,
        pagination: false,
      }}
      columns={columns}
      initialSelectedIds={initialSelectedIds}
      onConfirm={onConfirm}
      disabled={disabled}
    />
  );
};
