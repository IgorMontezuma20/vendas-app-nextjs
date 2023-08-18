import { useState } from "react";

import { ItemVenda, Venda } from "app/models/vendas";
import { Page } from "app/models/common/page";
import { Cliente } from "app/models/clientes";
import { useClienteService, useProdutoService } from "app/services";
import { Produto } from "app/models/produtos";
import { validationScheme } from "./validationScheme";

import { useFormik } from "formik";

import {
  AutoComplete,
  AutoCompleteChangeParams,
  AutoCompleteCompleteMethodParams,
} from "primereact/autocomplete";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { HiMiniTrash } from "react-icons/hi2";

import "primeflex/primeflex.css";

interface VendasFormProps {
  onSubmit: (venda: Venda) => void;
  onNovaVenda: () => void;
  vendaRealizada: boolean;
}

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const formScheme: Venda = {
  cliente: null,
  itens: [],
  total: 0,
  formaPagamento: "",
};

export const VendasForm: React.FC<VendasFormProps> = ({
  onSubmit,
  onNovaVenda,
  vendaRealizada,
}) => {
  const paymentMethod: String[] = ["DINHEIRO", "CARTAO "];
  const clientService = useClienteService();
  const productService = useProdutoService();
  const [productList, setProductList] = useState<Produto[]>([]);
  const [listaFiltradaProdutos, setListaFiltradaProdutos] = useState<Produto[]>(
    []
  );
  const [mensagem, setMensagem] = useState<string>("");
  const [productCode, setproductCode] = useState<string>("");
  const [productQtd, setProductQtd] = useState<number>(0);
  const [product, setProduct] = useState<Produto>(null);
  const [clientList, setClientList] = useState<Page<Cliente>>({
    content: [],
    first: 0,
    number: 0,
    size: 0,
    totalElements: 0,
  });

  const formik = useFormik<Venda>({
    onSubmit,
    initialValues: formScheme,
    validationSchema: validationScheme,
  });

  const handleClienteAutoComplete = (e: AutoCompleteCompleteMethodParams) => {
    const nome = e.query;
    clientService
      .find(nome, "", 0, 20)
      .then((clientes) => setClientList(clientes));
  };

  const handleClienteChange = (e: AutoCompleteChangeParams) => {
    const clienteSelecionado: Cliente = e.value;
    formik.setFieldValue("cliente", clienteSelecionado);
  };

  const handleCodigoProdutoSelect = (event: any) => {
    if (productCode)
      productService
        .carregarProduto(productCode)
        .then((produtoEncontrado) => setProduct(produtoEncontrado))
        .catch((error) => {
          setMensagem("Produto não encontrado!");
        });
  };

  const handleAddProduto = () => {
    const AddedItens = formik.values.itens;

    const jaExisteItemNaVenda = AddedItens?.some((iv: ItemVenda) => {
      return iv.produto.id === product.id;
    });

    if (jaExisteItemNaVenda) {
      AddedItens?.forEach((iv: ItemVenda) => {
        if (iv.produto.id === product.id) {
          iv.quantidade = iv.quantidade + productQtd;
        }
      });
    } else {
      AddedItens?.push({
        produto: product,
        quantidade: productQtd,
      });
    }

    setProduct(null);
    setproductCode("");
    setProductQtd(0);

    const total = totalSale();
    formik.setFieldValue("total", total);
  };

  const handleCLoseDialog = () => {
    setMensagem("");
    setproductCode("");
    setProduct(null);
  };

  const handleProdutoAutoComplete = async (
    e: AutoCompleteCompleteMethodParams
  ) => {
    if (!productList.length) {
      const produtosEncontrados = await productService.listar();
      setProductList(produtosEncontrados);
    }

    const produtosEncontrados = productList.filter((produto: Produto) => {
      return produto.nome?.toUpperCase().includes(e.query.toUpperCase());
    });

    setListaFiltradaProdutos(produtosEncontrados);
  };

  const dialogMensagemFooter = () => {
    return (
      <div>
        <Button label="Ok" onClick={handleCLoseDialog} />
      </div>
    );
  };

  const disableAddProdutoButton = () => {
    return !product || !productQtd;
  };

  const totalSale = () => {
    const totals: number[] = formik.values.itens?.map(
      (iv) => iv.quantidade * iv.produto.preco
    );
    if (totals.length) {
      return totals.reduce(
        (somatoriaAtual = 0, valorItemAtual) => somatoriaAtual + valorItemAtual
      );
    } else {
      return 0;
    }
  };

  const realizarNovaVenda = () => {
    onNovaVenda();
    formik.resetForm();
    formik.setFieldValue("itens", []);
    formik.setFieldTouched("itens", false);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="p-fluid">
        <div className="p-field">
          <label htmlFor="cliente">Cliente: *</label>
          <AutoComplete
            id="cliente"
            name="cliente"
            value={formik.values.cliente}
            field="nome"
            suggestions={clientList.content}
            completeMethod={handleClienteAutoComplete}
            onChange={handleClienteChange}
          />
          <small className="p-error p-d-block">{formik.errors.cliente}</small>
        </div>
        <div className="p-grid">
          <div className="p-col-2">
            <span className="p-float-label">
              <InputText
                id="codigoProduto"
                value={productCode}
                onBlur={handleCodigoProdutoSelect}
                onChange={(e) => setproductCode(e.target.value)}
              />
              <label htmlFor="codigoProduto">Código</label>
            </span>
          </div>
          <div className="p-col-6">
            <div className="p-field">
              <AutoComplete
                id="produto"
                name="produto"
                value={product}
                completeMethod={handleProdutoAutoComplete}
                suggestions={listaFiltradaProdutos}
                onChange={(e) => setProduct(e.value)}
                field="nome"
              />
            </div>
          </div>

          <div className="p-col-2">
            <span className="p-float-label">
              <InputText
                id="qtdProduto"
                value={productQtd}
                onChange={(e) => setProductQtd(parseInt(e.target.value))}
              />
              <label htmlFor="qtdProduto">QTD</label>
            </span>
          </div>

          <div className="p-col-2">
            <Button
              type="button"
              disabled={disableAddProdutoButton()}
              label="Adicionar"
              onClick={handleAddProduto}
            />
          </div>

          <div className="p-col-12">
            <DataTable
              value={formik.values.itens}
              emptyMessage="Nenhum produto adicionado."
            >
              <Column
                body={(item: ItemVenda) => {
                  const handleRemoveSaleItem = () => {
                    const newList = formik.values.itens?.filter(
                      (iv) => iv.produto.id !== item.produto.id
                    );
                    formik.setFieldValue("itens", newList);
                  };
                  return (
                    <Button
                      className="p-button-raised p-button-danger"
                      icon={HiMiniTrash}
                      type="button"
                      label="Remover"
                      onClick={handleRemoveSaleItem}
                    />
                  );
                }}
              />
              <Column field="produto.id" header="Código" />
              <Column field="produto.sku" header="SKU" />
              <Column field="produto.nome" header="Produto" />
              <Column field="produto.preco" header="Preço Unitário" />
              <Column field="quantidade" header="QTD" />
              <Column
                header="Total"
                body={(iv: ItemVenda) => {
                  const total = iv.produto.preco * iv.quantidade;
                  const formattedTotal = moneyFormatter.format(total);
                  return <div>{formattedTotal}</div>;
                }}
              />
            </DataTable>
            <small className="p-error p-d-block">
              {formik.touched && formik.errors.itens}
            </small>
          </div>

          <div className="p-col-5">
            <div className="p-field">
              <label htmlFor="paymeantMethod">Forma de Pagamento: *</label>
              <Dropdown
                id="paymeantMethod"
                options={paymentMethod}
                value={formik.values.formaPagamento}
                onChange={(e) =>
                  formik.setFieldValue("formaPagamento", e.value)
                }
                placeholder="Selecione..."
              />
              <small className="p-error p-d-block">
                {formik.touched && formik.errors.formaPagamento}
              </small>
            </div>
          </div>

          <div className="p-col-2">
            <div className="p-field">
              <label htmlFor="itens">Itens: </label>
              <InputText value={formik.values.itens?.length} disabled />
            </div>
          </div>

          <div className="p-col-3">
            <div className="p-field">
              <label htmlFor="total">Total: </label>
              <InputText
                value={moneyFormatter.format(formik.values.total)}
                disabled
              />
            </div>
          </div>
        </div>
        {!vendaRealizada && <Button type="submit" label="Finalizar" />}
        {vendaRealizada && (
          <Button
            type="button"
            onClick={realizarNovaVenda}
            label="Nova Venda"
            className="p-button-success"
          />
        )}
      </div>

      <Dialog
        header="Atenção"
        position="top"
        visible={!!mensagem}
        onHide={handleCLoseDialog}
        footer={dialogMensagemFooter}
      >
        {mensagem}
      </Dialog>
    </form>
  );
};
