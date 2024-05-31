import {
  ActionIcon,
  Button,
  NumberInput,
  Table,
  TextInput,
} from "@mantine/core";
import React, { useRef, useState } from "react";
import { FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { IoSave } from "react-icons/io5";
import { AdditionalCost } from "../../models";

interface Props {
  onSaveClick?: (costs: AdditionalCost[]) => void;
}

const AdditionalCostEditor: React.FC<Props> = ({ onSaveClick }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [costs, setCosts] = useState<AdditionalCost[]>([]);
  const nameRef = useRef<any>(null!);

  const handleRemove = (id: number) => {
    setCosts(costs.filter((c) => c.id !== id));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setCosts([
      ...costs,
      {
        id: costs.length + 1,
        description,
        amount,
      },
    ]);

    setDescription("");
    setAmount(0);
    nameRef.current.focus();
  };

  const handleSave = () => {
    if (onSaveClick) {
      onSaveClick(costs);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <TextInput
          ref={nameRef}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
        <NumberInput
          value={amount}
          placeholder="Amount"
          onChange={(e) => setAmount(+e)}
        />
        <ActionIcon variant="light" type="submit" size="lg">
          <FiPlusCircle />
        </ActionIcon>
      </div>
      <div>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {costs.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td>{item.description}</Table.Td>
                <Table.Td>£{item.amount}</Table.Td>
                <Table.Td align="right">
                  <ActionIcon
                    variant="outline"
                    color="red"
                    onClick={() => handleRemove(item.id)}
                  >
                    <FiTrash2 />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
      <Button
        onClick={handleSave}
        disabled={costs.length === 0}
        leftSection={<IoSave />}
      >
        Save changes
      </Button>
    </form>
  );
};

export default AdditionalCostEditor;
