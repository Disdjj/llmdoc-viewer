import { cn } from "@/lib/utils"
import type { TreeNode } from "@/types"

interface FileTreeProps {
  nodes: TreeNode[]
  selectedPath?: string
  onSelect: (path: string, sha: string) => void
}

export function FileTree({ nodes, selectedPath, onSelect }: FileTreeProps) {
  return (
    <div className="text-sm space-y-1">
      {nodes.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          selectedPath={selectedPath}
          onSelect={onSelect}
          level={0}
        />
      ))}
    </div>
  )
}

interface FileTreeNodeProps {
  node: TreeNode
  selectedPath?: string
  onSelect: (path: string, sha: string) => void
  level: number
}

// 移除 .md 后缀，像文档系统那样展示
function getDisplayName(name: string, isFolder: boolean): string {
  if (isFolder) return name
  // 移除 .md 后缀
  return name.replace(/\.md$/i, "")
}

function FileTreeNode({ node, selectedPath, onSelect, level }: FileTreeNodeProps) {
  const isFolder = node.type === "folder"
  const isSelected = selectedPath === node.path

  const displayName = getDisplayName(node.name, isFolder)

  if (isFolder) {
    return (
      <div className="pt-2 first:pt-0">
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
          {displayName}
        </div>
        {node.children && (
          <div className="ml-2 pl-1 border-l border-border/30 space-y-0.5">
            {node.children.map((child) => (
              <FileTreeNode
                key={child.path}
                node={child}
                selectedPath={selectedPath}
                onSelect={onSelect}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-2 py-1.5 px-3 rounded-md cursor-pointer transition-all duration-200",
        isSelected 
          ? "bg-primary/10 text-primary font-medium" 
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
      )}
      onClick={() => onSelect(node.path, node.sha)}
    >
      <span className="truncate">{displayName}</span>
    </div>
  )
}
