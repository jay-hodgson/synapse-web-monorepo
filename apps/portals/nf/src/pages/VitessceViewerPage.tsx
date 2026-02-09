import { useEffect, useRef } from 'react'

/**
 * Standalone page for Vitessce viewer that loads from CDN
 * This avoids React instance conflicts by using importmaps
 */
function VitessceViewerPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Dynamically inject importmap and Vitessce
    const importMap = document.createElement('script')
    importMap.type = 'importmap'
    importMap.textContent = JSON.stringify({
      imports: {
        react: 'https://esm.sh/react@18.2.0',
        'react-dom': 'https://esm.sh/react-dom@18.2.0',
        'react-dom/client': 'https://esm.sh/react-dom@18.2.0/client',
        vitessce: 'https://unpkg.com/vitessce@latest',
      },
    })
    document.head.appendChild(importMap)

    // Load Vitessce after importmap
    const script = document.createElement('script')
    script.type = 'module'
    script.textContent = `
      import React from 'react';
      import { createRoot } from 'react-dom/client';
      import { Vitessce } from 'vitessce';
      
      const config = {
  "version": "1.0.15",
  "name": "My example config",
  "description": "This demonstrates the JSON schema",
  "datasets": [
    {
      "uid": "D1",
      "name": "Eng et al., Nature 2019",
      "files": [
        {
          "fileType": "obsEmbedding.csv",
          "url": "https://data-1.vitessce.io/0.0.33/main/eng-2019/eng_2019_nature.cells.csv",
          "coordinationValues": {
            "obsType": "cell",
            "embeddingType": "t-SNE"
          },
          "options": {
            "obsIndex": "cell_id",
            "obsEmbedding": ["TSNE_1", "TSNE_2"]
          }
        },
        {
          "fileType": "obsEmbedding.csv",
          "url": "https://data-1.vitessce.io/0.0.33/main/eng-2019/eng_2019_nature.cells.csv",
          "coordinationValues": {
            "obsType": "cell",
            "embeddingType": "UMAP"
          },
          "options": {
            "obsIndex": "cell_id",
            "obsEmbedding": ["UMAP_1", "UMAP_2"]
          }
        },
        {
          "fileType": "obsSets.csv",
          "url": "https://data-1.vitessce.io/0.0.33/main/eng-2019/eng_2019_nature.cells.csv",
          "coordinationValues": {
            "obsType": "cell"
          },
          "options": {
            "obsIndex": "cell_id",
            "obsSets": [
              {
                "name": "Leiden Clustering",
                "column": "Leiden"
              },
              {
                "name": "k-means Clustering",
                "column": "Kmeans"
              }
            ]
          }
        }
      ]
    }
  ],
  "coordinationSpace": {
    "dataset": {
      "A": "D1"
    },
    "embeddingType": {
      "A": "UMAP",
      "B": "t-SNE"
    }
  },
  "layout": [
    {
      "component": "scatterplot",
      "coordinationScopes": {
        "dataset": "A",
        "embeddingType": "A"
      },
      "x": 6,
      "y": 0,
      "w": 6,
      "h": 6
    },
    {
      "component": "scatterplot",
      "coordinationScopes": {
        "dataset": "A",
        "embeddingType": "B"
      },
      "x": 0,
      "y": 0,
      "w": 6,
      "h": 6
    },
    {
      "component": "obsSets",
      "coordinationScopes": {
        "dataset": "A"
      },
      "x": 0,
      "y": 6,
      "w": 6,
      "h": 6
    },
    {
      "component": "obsSetSizes",
      "coordinationScopes": {
        "dataset": "A"
      },
      "x": 6,
      "y": 6,
      "w": 6,
      "h": 6
    }
  ],
  "initStrategy": "auto"
};
      
      const container = document.getElementById('vitessce-root');
      if (container) {
        const root = createRoot(container);
        root.render(
          React.createElement(Vitessce, {
            config,
            height: window.innerHeight,
            theme: 'light'
          })
        );
      }
    `
    document.body.appendChild(script)

    return () => {
      // Cleanup if needed
      document.head.removeChild(importMap)
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div
      id="vitessce-root"
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
      }}
    />
  )
}

export default VitessceViewerPage
