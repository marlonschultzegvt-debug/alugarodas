import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Check, ImagePlus, Save, Star, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { citiesByState, fuelOptions, stateOptions, vehicleCategories, vehicleYears } from "@/lib/vehicleCatalog";

const categoryToApi: Record<string, "carro" | "moto" | "eletrico" | "hibrido" | "utilitario" | "van" | "caminhonete"> = { Carro: "carro", Moto: "moto", Elétrico: "eletrico", Híbrido: "hibrido", Utilitário: "utilitario", Van: "van", Caminhonete: "caminhonete" };
const categoryFromApi: Record<string, string> = Object.fromEntries(Object.entries(categoryToApi).map(([label, value]) => [value, label]));
const fuelToApi: Record<string, "flex" | "gasolina" | "diesel" | "eletrico" | "hibrido" | "plug_in"> = { Flex: "flex", Gasolina: "gasolina", Diesel: "diesel", Elétrico: "eletrico", Híbrido: "hibrido", "Plug-in": "plug_in" };
const fuelFromApi: Record<string, string> = Object.fromEntries(Object.entries(fuelToApi).map(([label, value]) => [value, label]));
const transmissionToApi: Record<string, "manual" | "automatico" | "automatizado"> = { Manual: "manual", Automático: "automatico", Automatizado: "automatizado" };
const transmissionFromApi: Record<string, string> = Object.fromEntries(Object.entries(transmissionToApi).map(([label, value]) => [value, label]));

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.readAsDataURL(file);
  });
}

export default function EditVehicle() {
  const [, params] = useRoute<{ vehicleId: string }>("/anunciar/:vehicleId");
  const vehicleId = Number(params?.vehicleId);
  const vehicleQuery = trpc.marketplace.vehicle.useQuery({ id: vehicleId }, { enabled: Number.isInteger(vehicleId) && vehicleId > 0 });
  const imagesQuery = trpc.marketplace.vehicleImages.useQuery({ vehicleId }, { enabled: Number.isInteger(vehicleId) && vehicleId > 0 });
  const updateVehicle = trpc.marketplace.vehicleUpdate.useMutation();
  const uploadImage = trpc.marketplace.vehicleImageUpload.useMutation();
  const deleteImage = trpc.marketplace.vehicleImageDelete.useMutation();
  const setCover = trpc.marketplace.vehicleImageCover.useMutation();
  const [loadedId, setLoadedId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ brand: "", model: "", version: "", year: "", category: "", fuel: "", transmission: "", state: "", city: "", weeklyPrice: "", monthlyPrice: "", deposit: "", kmLimitMonthly: "", description: "", rentalRequirements: "", status: "draft" as "draft" | "active" | "paused" | "rented", insuranceIncluded: false, acceptsApp: false, acceptsUberX: false, acceptsUberComfort: false, acceptsUberBlack: false, accepts99: false });

  useEffect(() => {
    const vehicle = vehicleQuery.data;
    if (!vehicle || loadedId === vehicle.id) return;
    setLoadedId(vehicle.id);
    setForm({
      brand: vehicle.brand, model: vehicle.model, version: vehicle.version ?? "", year: String(vehicle.year),
      category: categoryFromApi[vehicle.category] ?? "Carro", fuel: fuelFromApi[vehicle.fuel] ?? "Flex", transmission: transmissionFromApi[vehicle.transmission] ?? "Automático",
      state: vehicle.state, city: vehicle.city, weeklyPrice: vehicle.weeklyPrice ?? "", monthlyPrice: vehicle.monthlyPrice ?? "", deposit: vehicle.deposit ?? "", kmLimitMonthly: vehicle.kmLimitMonthly ? String(vehicle.kmLimitMonthly) : "",
      description: vehicle.description ?? "", rentalRequirements: vehicle.rentalRequirements ?? "", status: vehicle.status,
      insuranceIncluded: vehicle.insuranceIncluded, acceptsApp: vehicle.acceptsApp, acceptsUberX: vehicle.acceptsUberX, acceptsUberComfort: vehicle.acceptsUberComfort, acceptsUberBlack: vehicle.acceptsUberBlack, accepts99: vehicle.accepts99,
    });
  }, [vehicleQuery.data, loadedId]);

  const cities = useMemo(() => citiesByState[form.state] ?? [], [form.state]);
  const pending = updateVehicle.isPending || uploadImage.isPending || deleteImage.isPending || setCover.isPending;
  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((current) => ({ ...current, [key]: value }));

  if (vehicleQuery.isLoading) return <main className="dashboard-page"><div className="container empty-state"><h1>Carregando anúncio…</h1></div></main>;
  if (!vehicleQuery.data) return <main className="dashboard-page"><div className="container empty-state"><h1>Anúncio não encontrado.</h1><Link className="primary-button" href="/dashboard">Voltar ao painel</Link></div></main>;

  const uploadSelected = async (files: File[]) => {
    setError(""); setNotice("");
    const existing = imagesQuery.data?.length ?? 0;
    if (existing + files.length > 6) { setError("Você pode manter no máximo 6 fotos por anúncio."); return; }
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) { setError("Use imagens JPG, PNG ou WebP com até 5 MB cada."); return; }
      const data = await fileToBase64(file);
      await uploadImage.mutateAsync({ vehicleId, fileName: file.name, contentType: file.type as "image/jpeg" | "image/png" | "image/webp", data, sortOrder: existing + index });
    }
    await imagesQuery.refetch();
    setNotice("Fotos enviadas e vinculadas ao anúncio.");
  };

  return <main className="advertise-page"><section className="container advertiser-flow"><div className="listing-form edit-listing-form"><div className="form-head"><div><span className="eyebrow orange">EDITAR ANÚNCIO</span><h1>{vehicleQuery.data.brand} {vehicleQuery.data.model}</h1><p>Atualize condições, disponibilidade e fotos. As alterações ficam vinculadas somente ao seu anúncio.</p></div><Link className="outline-button" href="/dashboard"><ArrowLeft size={16} /> Voltar ao painel</Link></div>
    <form onSubmit={async (event) => { event.preventDefault(); setError(""); setNotice(""); try { await updateVehicle.mutateAsync({ vehicleId, brand: form.brand, model: form.model, version: form.version || undefined, year: Number(form.year), category: categoryToApi[form.category], fuel: fuelToApi[form.fuel], transmission: transmissionToApi[form.transmission], state: form.state, city: form.city, weeklyPrice: form.weeklyPrice || undefined, monthlyPrice: form.monthlyPrice || undefined, deposit: form.deposit || undefined, kmLimitMonthly: form.kmLimitMonthly ? Number(form.kmLimitMonthly) : undefined, description: form.description, rentalRequirements: form.rentalRequirements || undefined, status: form.status, insuranceIncluded: form.insuranceIncluded, acceptsApp: form.acceptsApp, acceptsUberX: form.acceptsUberX, acceptsUberComfort: form.acceptsUberComfort, acceptsUberBlack: form.acceptsUberBlack, accepts99: form.accepts99 }); setNotice("Anúncio atualizado com sucesso."); await vehicleQuery.refetch(); } catch { setError("Não foi possível atualizar o anúncio. Revise os campos e tente novamente."); } }}>
      <div className="form-grid"><label>Marca<input required value={form.brand} onChange={(e) => setField("brand", e.target.value)} /></label><label>Modelo<input required value={form.model} onChange={(e) => setField("model", e.target.value)} /></label><label>Versão<input value={form.version} onChange={(e) => setField("version", e.target.value)} /></label><label>Ano<select required value={form.year} onChange={(e) => setField("year", e.target.value)}>{vehicleYears.map((year) => <option key={year}>{year}</option>)}</select></label><label>Estado<select required value={form.state} onChange={(e) => { setField("state", e.target.value); setField("city", ""); }}>{stateOptions.map((item) => <option key={item.uf} value={item.uf}>{item.uf} · {item.name}</option>)}</select></label><label>Cidade<select required value={form.city} onChange={(e) => setField("city", e.target.value)}>{cities.map((city) => <option key={city}>{city}</option>)}</select></label><label>Preço semanal<input value={form.weeklyPrice} inputMode="decimal" onChange={(e) => setField("weeklyPrice", e.target.value)} /></label><label>Preço mensal<input value={form.monthlyPrice} inputMode="decimal" onChange={(e) => setField("monthlyPrice", e.target.value)} /></label><label>Caução<input value={form.deposit} inputMode="decimal" onChange={(e) => setField("deposit", e.target.value)} /></label><label>Limite km/mês<input value={form.kmLimitMonthly} inputMode="numeric" onChange={(e) => setField("kmLimitMonthly", e.target.value)} /></label><label>Combustível<select value={form.fuel} onChange={(e) => setField("fuel", e.target.value)}>{fuelOptions.map((item) => <option key={item}>{item}</option>)}</select></label><label>Câmbio<select value={form.transmission} onChange={(e) => setField("transmission", e.target.value)}><option>Automático</option><option>Manual</option><option>Automatizado</option></select></label><label>Categoria<select value={form.category} onChange={(e) => setField("category", e.target.value)}>{vehicleCategories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Status<select value={form.status} onChange={(e) => setField("status", e.target.value as typeof form.status)}><option value="draft">Rascunho</option><option value="paused">Pausado</option><option value="rented">Alugado</option></select></label></div>
      <div className="description-grid"><label>Descrição<textarea required minLength={10} rows={5} value={form.description} onChange={(e) => setField("description", e.target.value)} /></label><label>Requisitos para locação<textarea rows={5} value={form.rentalRequirements} onChange={(e) => setField("rentalRequirements", e.target.value)} /></label></div>
      <div className="check-options"><label><input type="checkbox" checked={form.acceptsApp} onChange={(e) => setField("acceptsApp", e.target.checked)} /> Aceita motorista de APP</label><label><input type="checkbox" checked={form.insuranceIncluded} onChange={(e) => setField("insuranceIncluded", e.target.checked)} /> Seguro incluso</label><label><input type="checkbox" checked={form.acceptsUberX} onChange={(e) => setField("acceptsUberX", e.target.checked)} /> UberX</label><label><input type="checkbox" checked={form.acceptsUberComfort} onChange={(e) => setField("acceptsUberComfort", e.target.checked)} /> Uber Comfort</label><label><input type="checkbox" checked={form.acceptsUberBlack} onChange={(e) => setField("acceptsUberBlack", e.target.checked)} /> Uber Black</label><label><input type="checkbox" checked={form.accepts99} onChange={(e) => setField("accepts99", e.target.checked)} /> 99</label></div>
      {error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="contact-success" role="status"><Check size={15} /> {notice}</p>}
      <button className="primary-button" type="submit" disabled={pending}>{pending ? "Salvando…" : <><Save size={16} /> Salvar alterações</>}</button>
    </form>
    <div className="form-divider" /><div className="form-subhead"><div><h2>Fotos do veículo</h2><span>Defina a capa e remova somente as imagens que não deseja manter.</span></div><label className="upload-picker"><ImagePlus size={16} /> Adicionar fotos<input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(event) => { const files = Array.from(event.target.files ?? []); if (files.length) void uploadSelected(files); event.currentTarget.value = ""; }} /></label></div>
    <div className="photo-preview-grid" aria-label="Fotos publicadas do veículo">{imagesQuery.data?.length ? imagesQuery.data.map((image) => <div className={image.isCover ? "photo-preview-card is-cover" : "photo-preview-card"} key={image.id}><img src={image.url} alt={image.altText ?? `Foto do veículo ${image.id}`} /><button className="cover-photo-button" type="button" disabled={pending || image.isCover} onClick={async () => { setError(""); await setCover.mutateAsync({ vehicleId, imageId: image.id }); await imagesQuery.refetch(); setNotice("Foto de capa atualizada."); }}><Star size={14} /> {image.isCover ? "Foto de capa" : "Usar como capa"}</button><button className="remove-photo-button" type="button" disabled={pending} onClick={async () => { if (!window.confirm("Remover esta foto do anúncio?")) return; setError(""); await deleteImage.mutateAsync({ vehicleId, imageId: image.id }); await imagesQuery.refetch(); setNotice("Foto removida do anúncio."); }}><Trash2 size={14} /> Remover</button></div>) : <div className="empty-state"><ImagePlus size={24} /><p>Este anúncio ainda não tem fotos. Adicione imagens reais para melhorar a conversão.</p></div>}</div>
  </div></section></main>;
}
