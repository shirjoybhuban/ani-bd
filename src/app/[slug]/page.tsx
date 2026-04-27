import { MyAnimeDashboard } from "@/components/my-anime-dashboard";
import { getDatasetIdsBySlug } from "@/lib/anime-datasets";

interface SlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const datasetIds = await getDatasetIdsBySlug(slug);

  if (!datasetIds) {
    return (
      <section className="rounded-xl border border-dashed border-violet-400/30 bg-slate-950/60 p-8 text-center">
        <p className="text-lg font-semibold text-white">No data found</p>
        <p className="mt-1 text-sm text-slate-400">No dataset is configured for `{slug}`.</p>
      </section>
    );
  }

  return <MyAnimeDashboard source="static" staticIds={datasetIds} datasetName={slug} />;
}
