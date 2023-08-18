import { Produto } from "app/models/produtos";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Cliente } from "app/models/clientes";
import React, { Component, PropsWithChildren } from "react";

import { AiFillEdit } from "react-icons/ai";
import {
  HiMiniTrash,
  HiOutlinePlusSmall,
  HiPencil,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi2";

//import "primeicons/primeicons.css";

interface TabelaProdutosProps {
  produtos: Array<Produto>;
  onEdit: (produto: Produto) => void;
  onDelete: (produto: Produto) => void;
}

export const TabelaProdutos: React.FC<
  PropsWithChildren<TabelaProdutosProps>
> = ({ produtos, onEdit, onDelete }) => {
  const actionTemplate = (registro: Produto) => {
    const url = `/cadastros/produtos?id=${registro.id}`;
    return (
      <div className="field is-grouped">
        <p className="control">
          <Button
            label="Editar"
            icon={HiPencil}
            className="p-button-raised p-button-info"
            onClick={(e) => onEdit(registro)}
          />
        </p>
        <p className="control">
          <Button
            label="deletar"
            className="p-button-raised p-button-danger"
            icon={HiMiniTrash}
            iconPos="left"
            onClick={(event) => {
              confirmDialog({
                message: "Deseja excluir este registro?",
                acceptLabel: "Sim",
                rejectLabel: "Não",
                accept: () => onDelete(registro),
                header: "Confirmação",
              });
            }}
          />
        </p>
      </div>
    );
  };
  return (
    <DataTable value={produtos} paginator rows={5}>
      <Column field="id" header="Id" style={{ width: "5%" }} />
      <Column field="sku" header="Código de Barras" style={{ width: "20%" }} />
      <Column field="nome" header="Nome" style={{ width: "25%" }} />
      <Column field="preco" header="Preço" style={{ width: "15%" }} />
      <Column
        className=""
        header=""
        body={actionTemplate}
        style={{ width: "20%" }}
      />
    </DataTable>
  );
};
