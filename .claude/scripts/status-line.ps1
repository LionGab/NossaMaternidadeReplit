# Claude Code Custom Status Line - Windows PowerShell
# Author: GitHub Copilot
# Purpose: Display real-time dashboard with context usage, Git branch, project folder, and model name
# Usage: Configure in Claude Code settings or call directly

param(
    [switch]$Debug = $false,
    [switch]$ShowJson = $false
)

# Color codes for terminal
$Colors = @{
    Reset       = "`e[0m"
    Bold        = "`e[1m"
    Dim         = "`e[2m"

    # Foreground colors
    Black       = "`e[30m"
    Red         = "`e[31m"
    Green       = "`e[32m"
    Yellow      = "`e[33m"
    Blue        = "`e[34m"
    Magenta     = "`e[35m"
    Cyan        = "`e[36m"
    White       = "`e[37m"

    # Background colors
    BgRed       = "`e[41m"
    BgGreen     = "`e[42m"
    BgYellow    = "`e[43m"
    BgBlue      = "`e[44m"
    BgMagenta   = "`e[45m"
    BgCyan      = "`e[46m"
}

function Get-ContextUsage {
    <#
    .SYNOPSIS
    Attempts to read Claude Code context usage from internal files or environment.
    .NOTES
    Claude Code stores context info in various ways. This tries multiple methods.
    #>

    $contextInfo = @{
        percentUsed = 0
        tokensUsed = 0
        tokensMax = 200000
        barLength = 20
    }

    try {
        # Method 1: Check if Claude Code exposes context via environment variable
        if ($env:CLAUDE_CONTEXT_USAGE) {
            $usage = $env:CLAUDE_CONTEXT_USAGE | ConvertFrom-Json
            $contextInfo.percentUsed = $usage.percentUsed
            $contextInfo.tokensUsed = $usage.tokensUsed
        }

        # Method 2: Check .claude directory for session context file (if it exists)
        $claudeHome = Join-Path $env:USERPROFILE ".claude"
        $contextFile = Join-Path $claudeHome "context.json"

        if (Test-Path $contextFile) {
            $context = Get-Content $contextFile -Raw | ConvertFrom-Json
            if ($context.usage) {
                $contextInfo.tokensUsed = $context.usage.tokens
                $contextInfo.percentUsed = [Math]::Round(($context.usage.tokens / $contextInfo.tokensMax) * 100, 1)
            }
        }
    }
    catch {
        if ($Debug) {
            Write-Host "[WARN] Context warning: $_" -ForegroundColor Yellow
        }
    }

    return $contextInfo
}

function Get-GitBranch {
    <#
    .SYNOPSIS
    Safely retrieves the current Git branch name.
    #>

    try {
        $branch = git rev-parse --abbrev-ref HEAD 2>$null
        if ($branch) {
            return $branch.Trim()
        }
    }
    catch {
        if ($Debug) {
            Write-Host "[WARN] Git warning: $_" -ForegroundColor Yellow
        }
    }

    return "no-git"
}

function Get-ProjectFolder {
    <#
    .SYNOPSIS
    Returns the current project folder name (not full path).
    #>

    $currentFolder = Split-Path -Leaf (Get-Location)
    return $currentFolder -replace "^tmp.*?-cwd$", "temp-dir"
}

function Get-ModelName {
    <#
    .SYNOPSIS
    Reads the model name from environment or defaults to Claude Haiku.
    .NOTES
    Claude Code typically runs Claude 3.5 Sonnet by default, but can be overridden.
    #>

    if ($env:CLAUDE_MODEL) {
        return $env:CLAUDE_MODEL
    }

    # Default assumption for Claude Code
    return "Claude 3.5 Sonnet"
}

function New-ProgressBar {
    <#
    .SYNOPSIS
    Creates a visual progress bar for token usage.
    #>

    param(
        [int]$Percent,
        [int]$Length = 20
    )

    $filled = [Math]::Round(($Percent / 100) * $Length)
    $empty = $Length - $filled

    $barColor = if ($Percent -lt 50) { $Colors.Green }
    elseif ($Percent -lt 75) { $Colors.Yellow }
    else { $Colors.Red }

    $filledBar = "█" * $filled
    $emptyBar = "░" * $empty

    return "$barColor$filledBar$emptyBar$($Colors.Reset)"
}

function Format-StatusLine {
    <#
    .SYNOPSIS
    Assembles the final colored status line with all components.
    #>

    param(
        [hashtable]$Context,
        [string]$Branch,
        [string]$Project,
        [string]$Model
    )

    # Component 1: Model name (Cyan, bold)
    $modelPart = "$($Colors.Cyan)$($Colors.Bold)@ $Model$($Colors.Reset)"

    # Component 2: Context bar with percentage (Green/Yellow/Red)
    $bar = New-ProgressBar -Percent $Context.percentUsed -Length 15
    $contextPart = "$bar $($Colors.Blue)$($Context.percentUsed)%$($Colors.Reset)"

    # Component 3: Git branch (Magenta)
    $branchIcon = if ($Branch -eq "main") { "[main]" } else { "[$Branch]" }
    $branchPart = "$($Colors.Magenta)$branchIcon$($Colors.Reset)"

    # Component 4: Project folder (Yellow, dimmed)
    $projectPart = "$($Colors.Dim)$($Colors.Yellow)[$Project]$($Colors.Reset)"

    # Assemble with separators
    $separator = "$($Colors.Dim)|$($Colors.Reset)"

    return $statusLine
}

# Main execution
try {
    $context = Get-ContextUsage
    $branch = Get-GitBranch
    $project = Get-ProjectFolder
    $model = Get-ModelName

    if ($ShowJson) {
        # Debug output: show raw JSON structure
        $output = @{
            model = $model
            context = $context
            branch = $branch
            project = $project
            timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        }
        Write-Host ($output | ConvertTo-Json -Depth 3)
    }
    else {
        # Formatted status line
        $statusLine = Format-StatusLine -Context $context -Branch $branch -Project $project -Model $model
        Write-Host $statusLine
    }
}
catch {
    Write-Host "$($Colors.Red)[ERROR] Status line error: $_$($Colors.Reset)" -ForegroundColor Red
    exit 1
}
