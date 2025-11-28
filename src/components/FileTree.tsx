import { useState } from "react"
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TreeNode } from "@/types"

interface FileTreeProps {
  nodes: TreeNode[]
  selectedPath?: string
  onSelect: (path: string, sha: string) => void
}

export function FileTree({ nodes, selectedPath, onSelect }: FileTreeProps) {
  return (
    <div className="text-sm">
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

function FileTreeNode({ node, selectedPath, onSelect, level }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0)
  const isFolder = node.type === "folder"
  const isSelected = selectedPath === node.path
  const isMarkdown = node.name.endsWith(".md")

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded)
    } else {
      onSelect(node.path, node.sha)
    }
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 py-1 px-2 rounded cursor-pointer hover:bg-accent transition-colors",
          isSelected && "bg-accent"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {isFolder ? (
          <>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 shrink-0 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 shrink-0 text-blue-500" />
            )}
          </>
        ) : (
          <>
            <span className="w-4" />
            <File
              className={cn(
                "h-4 w-4 shrink-0",
                isMarkdown ? "text-green-500" : "text-muted-foreground"
              )}
            />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {isFolder && isExpanded && node.children && (
        <div>
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
