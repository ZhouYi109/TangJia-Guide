import BottomNav from '../components/BottomNav';
import RouteCard from '../components/RouteCard';

export default function Home() {
  const routes = [
    {
      title: "宗族文化寻根游",
      duration: "约 1.5 小时",
      nodes: ["唐家三庙", "瑞芝唐公祠", "望慈山房"],
      targetNodeId: "tangjia-sanmiao"
    },
    {
      title: "近代买办商贸游",
      duration: "约 2 小时",
      nodes: ["山房路", "唐绍仪故居", "共乐园"],
      targetNodeId: "gongleyuan"
    },
    {
      title: "非遗与建筑纹理游",
      duration: "约 1 小时",
      nodes: ["蚝壳墙巷道", "满洲窗老宅", "茶果非遗摊位"],
      targetNodeId: "haokeqiang"
    }
  ];

  return (
    <>
      <BottomNav />
      <div className="page-content" style={{ paddingTop: 0 }}>
        {/* 全局地图导视图 */}
        <section style={styles.mapSection}>
          <img src="/global_map.png" alt="全局地图" style={styles.globalMap} />
          <div style={styles.mapOverlay} className="glass-panel">
            <h2 style={styles.subtitle}>探索视觉与历史的交响</h2>
            <p style={styles.description}>
              欢迎来到唐家古镇。这里不仅有中西合璧的建筑遗迹，更隐藏着无数待您发现的传统纹样与视觉密码。
            </p>
          </div>
        </section>

        <section style={styles.routes}>
          <h3 style={styles.sectionTitle}>精选路线</h3>
          {routes.map((route, index) => (
            <RouteCard key={index} {...route} />
          ))}
        </section>
      </div>
    </>
  );
}

const styles = {
  mapSection: {
    position: 'relative',
    margin: '0 -20px 24px -20px',
  },
  globalMap: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    display: 'block',
  },
  mapOverlay: {
    position: 'relative',
    marginTop: '-40px',
    marginLeft: '20px',
    marginRight: '20px',
    padding: '20px',
    borderRadius: '16px',
    zIndex: 10,
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '8px',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-family-serif)',
  },
  description: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
  },
  routes: {
    marginTop: '40px',
  },
  sectionTitle: {
    fontSize: '18px',
    marginBottom: '16px',
    color: 'var(--color-text-primary)',
    borderLeft: '4px solid var(--color-accent-blue)',
    paddingLeft: '8px',
  }
};
